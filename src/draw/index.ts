import { COVER_ELEMENT_ID, DRAW_SIGNAL } from './constants';

type createElProps = {
  type: string;
  options?: { [key: string]: string };
  children?: Element | string | (Element | string)[];
};

type El = Element & {
  createElement?: (args: createElProps) => El;
};

type DrawPoint = [
  x: number,
  y: number,
  width: number,
  height: number,
  signal: DRAW_SIGNAL
];

interface DrawListener {
  (drawPoint: DrawPoint): void;
}

function getOrganizerElement(organizerId: string) {
  const div = document.querySelector(
    `div[data-participant-id="${organizerId}"]`
  );

  if (!div) {
    return null;
  }

  const video = div.querySelector('video');
  if (!video) {
    return null;
  }

  return video.parentElement;
}

function createElement({
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

function createLayer() {
  const target = document.querySelector(COVER_ELEMENT_ID);

  if (target) {
    return target;
  }

  return createElement({
    type: 'div',
    options: {
      id: COVER_ELEMENT_ID,
      style: `position:absolute;z-index:10;width:100%;height:100%;cursor:url(${chrome.runtime.getURL(
        'draw-icon.png'
      )}), auto;`,
    },
  });
}

class Draw {
  isDrawing: boolean;
  drawListener: DrawListener;
  coverEl: Element | null;

  constructor(drawListener: DrawListener) {
    this.isDrawing = false;
    this.drawListener = drawListener;
    this.coverEl = null;

    this.mousedown = this.mousedown.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.install = this.install.bind(this);
  }

  mousedown({ offsetX, offsetY, target }: MouseEvent) {
    this.isDrawing = true;
    const { clientWidth, clientHeight } = target as HTMLElement;
    const drawPoint: DrawPoint = [
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
      DRAW_SIGNAL.DOWN,
    ];

    this.drawListener(drawPoint);
  }

  mousemove({ offsetX, offsetY, target }: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }

    const { clientWidth, clientHeight } = target as HTMLElement;
    const drawPoint: DrawPoint = [
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
      DRAW_SIGNAL.MOVE,
    ];

    this.drawListener(drawPoint);
  }

  mouseup({ offsetX, offsetY, target }: MouseEvent) {
    this.isDrawing = false;

    const { clientWidth, clientHeight } = target as HTMLElement;
    const drawPoint: DrawPoint = [
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
      DRAW_SIGNAL.UP,
    ];

    this.drawListener(drawPoint);
  }

  install(organizerId: string) {
    this.uninstall();

    this.coverEl = createLayer();

    this.coverEl.addEventListener('mousedown', this.mousedown as EventListener);
    this.coverEl.addEventListener('mousemove', this.mousemove as EventListener);
    window.addEventListener('mouseup', this.mouseup);

    const interval = setInterval(() => {
      const parentEl = getOrganizerElement(organizerId);
      if (parentEl) {
        parentEl.appendChild(this.coverEl as Element);
        clearInterval(interval);
      }
    }, 100);
  }

  uninstall() {
    if (!this.coverEl) {
      return;
    }

    this.coverEl.remove();
    window.removeEventListener('mouseup', this.mouseup);
  }
}

export default Draw;
