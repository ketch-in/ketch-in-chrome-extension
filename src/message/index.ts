import { MESSAGE_KEY, RTC_EVENT } from './constants';

export type Message = {
  key: MESSAGE_KEY;
  payload?: any;
};

function get<T = any>(key: MESSAGE_KEY) {
  return chrome.runtime.sendMessage<Message, T>({ key: key });
}

function set<T>(key: MESSAGE_KEY, payload: any) {
  const message: Message = {
    key: key,
    payload: payload,
  };

  return chrome.runtime.sendMessage<Message, void>(message);
}

export { MESSAGE_KEY, RTC_EVENT };

export default {
  get,
  set,
};
