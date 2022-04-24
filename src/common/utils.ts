import {
  AttendeeInfo,
  createElProps,
  DataInfo,
  El,
  OrganizerInfo,
} from './types';

const emptyOrganizer: OrganizerInfo = {
  id: null,
  active: false,
  toggle: false,
};

const emptyAttendee: AttendeeInfo = {
  target: 'other',
  toggle: false,
};

/**
 * Element를 생성합니다.
 */
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

/**
 * background에 데이터를 요청 및 수정합니다.
 */
export function sendMessage<T>(type: string): Promise<T>;
export function sendMessage<T>(type: string, value: T): Promise<boolean>;
export function sendMessage<T>(type: string, value?: T): Promise<boolean | T> {
  const isGet = value === undefined;
  return new Promise((resolve) => {
    if (isGet) {
      const response = (
        request: {
          type: string;
          message: boolean | T | PromiseLike<boolean | T>;
        },
        _: unknown,
        sendResponse: (arg0: boolean) => void
      ) => {
        sendResponse(true);
        chrome.runtime.onMessage.removeListener(response);
        if (request.type === `${type}:get:set`) {
          resolve(request.message);
        }
      };

      chrome.runtime.onMessage.addListener(response);
    }
    chrome.runtime.sendMessage({
      type: `${type}:${isGet ? 'get' : 'set'}`,
      message: value,
    });
  });
}

export function handshaking(target: string) {
  return sendMessage<boolean>(`${target}:handshaking`);
}

/**
 * localStorage에 데이터를 저장 및 불러옵니다.
 */
export function storage(tabId: number, type: 'all'): Promise<DataInfo>;
export function storage(tabId: number, type: 'attendee'): Promise<AttendeeInfo>;
export function storage(
  tabId: number,
  type: 'attendee',
  data?: AttendeeInfo
): Promise<boolean>;
export function storage(
  tabId: number,
  type: 'attendee',
  data?: AttendeeInfo
): Promise<AttendeeInfo | boolean>;
export function storage(
  tabId: number,
  type: 'organizer'
): Promise<OrganizerInfo>;
export function storage(
  tabId: number,
  type: 'organizer',
  data?: OrganizerInfo
): Promise<boolean>;
export function storage(
  tabId: number,
  type: 'organizer',
  data?: OrganizerInfo
): Promise<OrganizerInfo | boolean>;
export function storage(
  tabId: number,
  type: 'all' | 'organizer' | 'attendee',
  data?: OrganizerInfo | AttendeeInfo
): Promise<OrganizerInfo | AttendeeInfo | DataInfo | boolean> {
  const hasData = data !== undefined;
  return new Promise((resolve) => {
    chrome.storage.local.get(`${tabId}`, (items) => {
      const item = items[`${tabId}`] || {};
      if (!hasData) {
        if (type === 'all') {
          return resolve(item);
        }
        return resolve(
          item[type] || (type === 'attendee' ? emptyAttendee : emptyOrganizer)
        );
      }

      chrome.storage.local
        .set({
          [`${tabId}`]: {
            ...item,
            [type]: {
              ...item[type],
              ...data,
            },
          },
        })
        .then(() => resolve(true));
    });
  });
}

/**
 * 콘솔창에 로그를 출력합니다.
 * @param msg 출력할 메시지
 * @param color 메시지 컬러
 */
export function log(msg: unknown, color = '#07D97A') {
  console.trace('%c[KETCH IN] %c%o', 'color: #0895FE', `color: ${color}`, msg);
}
