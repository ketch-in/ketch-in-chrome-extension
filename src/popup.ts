/** 참석자의 toggle 정보를 background에서 가져옵니다. */
function getToggle(): Promise<boolean> {
  return sendMessage<boolean>('popup:toggle');
}

/** 참석자의 toggle 정보를 background에 전송합니다. */
function setToggle(toggle: boolean): Promise<boolean> {
  return sendMessage<boolean>('popup:toggle', toggle);
}

/** 현재 tab의 URL 정보를 background에서 가져옵니다. */
function getUrl(): Promise<string> {
  return sendMessage<string>('popup:url');
}

/** Toggle의 상태 값을 background에 요청합니다. */
function getStatus(): Promise<{ active: boolean; enabled: boolean }> {
  return sendMessage<{ active: boolean; enabled: boolean }>('popup:status');
}

/** toggle 버튼을 생성합니다. */
async function createToggleButton(enabled: boolean) {
  const body = document.querySelector('body');
  const toggle = await getToggle();
  if (!body) {
    return;
  }

  const div = createElement({
    type: 'div',
    options: {
      class: enabled ? `toggle${toggle ? ' on' : ''}` : 'toggle disabled',
    },
  });
  if (enabled) {
    div.addEventListener('click', () => setToggle(div.classList.toggle('on')));
  }

  body.className = '';
  body.appendChild(div);
}

/** 에러 문구를 표시합니다. */
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

/** Popup을 초기화합니다. 클릭시마다 호출됩니다. */
async function initialPopup() {
  const result = await handshaking('popup');

  if (!result) {
    return;
  }

  const url = await getUrl();

  // Google Meet이 아닌 경우 에러메시지를 출력합니다.
  if (!url || !url.match(/^https:\/\/meet.google.com\/.*/)) {
    return createErrorMessage();
  }

  const { active, enabled } = await getStatus();
  if (!active) {
    return createErrorMessage(
      '발표를 시작하거나 발표가 시작될 때까지 대기해주세요.'
    );
  }

  createToggleButton(enabled);
}

initialPopup();
