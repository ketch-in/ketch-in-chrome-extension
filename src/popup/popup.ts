import './popup.css';
import message, { MESSAGE_KEY } from '../message';
import { TARGET } from '../storage';

export type createElProps = {
  type: string;
  options?: { [key: string]: string };
  children?: Element | string | (Element | string)[];
};

export type El = Element & {
  createElement?: (args: createElProps) => El;
};

export function createElement({
  type,
  options = {},
  children = [],
}: createElProps): El {
  const element = document.createElement(type) as El;

  Object.keys(options).forEach((key) =>
    element.setAttribute(key, options[key])
  );

  if (!Array.isArray(children)) {
    children = Array(children);
  }

  children.filter((item) => !!item).forEach((child) => element.append(child));

  element.createElement = (args: createElProps): El => {
    const el = createElement(args);
    element.append(el);
    return el;
  };

  return element;
}

function createErrorMessage(
  message = 'Google Meet를 선택 후 다시 시도해 주세요.'
) {
  const body = document.querySelector('body');

  if (!body) {
    return;
  }
  body.className = 'error';
  body.appendChild(
    createElement({
      type: 'div',
      options: { class: 'error' },
      children: message,
    })
  );
}

function setToggle(target: TARGET, toggle: boolean) {
  console.log('set toggle', target, toggle);
  if (target === TARGET.SELF) {
    message.set(MESSAGE_KEY.ACTIVE, toggle);
  }

  if (target === TARGET.OTHER) {
    message.set(MESSAGE_KEY.TOGGLE, toggle);
  }
}

async function createToggleButton(
  target: TARGET,
  active: boolean,
  toggle: boolean
) {
  const body = document.querySelector('body');
  if (!body) {
    return;
  }

  if (target === TARGET.SELF) {
    const div = createElement({
      type: 'div',
      options: {
        class: `toggle${active ? ' on' : ''}`,
      },
    });

    div.addEventListener('click', () =>
      setToggle(target, div.classList.toggle('on'))
    );

    body.appendChild(div);
  }

  if (target === TARGET.OTHER) {
    const div = createElement({
      type: 'div',
      options: {
        class: active ? `toggle${toggle ? ' on' : ''}` : 'toggle disabled',
      },
    });

    if (active) {
      div.addEventListener('click', () =>
        setToggle(target, div.classList.toggle('on'))
      );
    }

    body.appendChild(div);
  }
}

async function initPopup() {
  const url = await message.get<string>(MESSAGE_KEY.URL);
  if (!url || !url.includes('meet.google.com')) {
    createErrorMessage();
    return;
  }

  const enabled = await message.get<boolean>(MESSAGE_KEY.ENABLED);
  if (!enabled) {
    createErrorMessage('발표를 시작하거나 발표가 시작될 때까지 대기해주세요.');
    return;
  }

  const target = await message.get<TARGET>(MESSAGE_KEY.TARGET);
  const active = await message.get<boolean>(MESSAGE_KEY.ACTIVE);
  const toggle = await message.get<boolean>(MESSAGE_KEY.TOGGLE);

  createToggleButton(target, active, toggle);
}

initPopup();
