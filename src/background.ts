import {
  OrganizerInfo,
  AttendeeInfo,
  SendMessageRequest,
} from './common/types';
import { sendMessage, storage } from './common/utils';

const emptyOrganizer: OrganizerInfo = {
  id: null,
  active: false,
  toggle: false,
};

const emptyAttendee: AttendeeInfo = {
  target: 'other',
  toggle: false,
};

/** 활성화된 Tab를 반환합니다. Popup응답이 왔을 경우 사용합니다. */
async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/** 특정 탭에 sendMessage를 전송합니다.  */
function tabSendMessage<T>(id: number, type: string, message: T) {
  return chrome.tabs.sendMessage(id, { type: `${type}:set`, message });
}

/** content에 DataInfo 값을 sendMessage로 응답합니다. */
async function contentSendMessage(tabId: number, type: string) {
  const data = await storage(tabId, 'all');

  return tabSendMessage(tabId, type, data);
}

/** Popup에서 전달 받은 sendMessage를 처리합니다. */
async function handlePopupMessage(
  title: string,
  mode: string,
  request: SendMessageRequest<unknown>
) {
  const { type, message } = request;

  if (title === 'handshaking' && mode === 'get') {
    return sendMessage(type, true);
  }

  const tab = await getCurrentTab();
  const tabId = tab?.id as number;

  if (title === 'toggle' && mode === 'get') {
    const { toggle } = await storage(tabId, 'attendee');
    return await sendMessage(type, toggle || false);
  }

  if (title === 'toggle' && mode === 'set') {
    const toggle = message as boolean;
    await storage(tabId, 'attendee', { toggle });

    const { target } = await storage(tabId, 'attendee');

    if (target === 'self') {
      await storage(tabId, 'organizer', { active: toggle });
    }

    await contentSendMessage(tabId, 'content:toggle');
  }

  if (title === 'url' && mode === 'get') {
    const { url } = tab;
    return await sendMessage(type, url);
  }

  if (title === 'status' && mode === 'get') {
    const { attendee, organizer } = await storage(tabId, 'all');

    const active = !!organizer.id;
    const enabled =
      (attendee.target === 'self' && active) ||
      (attendee.target === 'other' && organizer.active);

    return await sendMessage(type, { active, enabled });
  }
}

/** Content에서 전달 받은 sendMessage를 처리합니다. */
async function handleContentMessage(
  title: string,
  mode: string,
  tabId: number,
  request: SendMessageRequest<unknown>
) {
  const { type } = request;

  if (title === 'handshaking' && mode === 'get') {
    return await tabSendMessage(tabId, type, true);
  }

  if (title === 'serverUrl' && mode === 'get') {
    return await chrome.storage.local.get('wsServerUrl', ({ wsServerUrl }) =>
      tabSendMessage(tabId, type, wsServerUrl)
    );
  }

  if (title === 'organizer-info' && mode === 'get') {
    return await contentSendMessage(tabId, type);
  }

  if (title === 'organizer-info' && mode === 'set') {
    const organizer = request.message as OrganizerInfo;

    await storage(tabId, 'attendee', emptyAttendee);
    await storage(tabId, 'organizer', organizer);

    return await contentSendMessage(tabId, 'content:toggle');
  }

  /** 발표를 시작했을 경우 호출됩니다. */
  if (title === 'start-organizer' && mode === 'set') {
    const participantId = request.message as string;

    await storage(tabId, 'organizer', {
      id: participantId,
      active: false,
      toggle: false,
    });
    await storage(tabId, 'attendee', { target: 'self' });

    return await contentSendMessage(tabId, 'content:id');
  }

  /** 발표를 중단했을 경우 호출됩니다. */
  if (title === 'stop-organizer' && mode === 'set') {
    await storage(tabId, 'organizer', emptyOrganizer);
    await storage(tabId, 'attendee', { target: 'other' });

    return await contentSendMessage(tabId, 'content:id');
  }

  if (title === 'initial' && mode === 'set') {
    await storage(tabId, 'attendee', emptyAttendee);
    await storage(tabId, 'organizer', emptyOrganizer);

    return await contentSendMessage(tabId, 'content:toggle');
  }
}

/** extension이 설치되었을 경우 실행됩니다. */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear(() => {
    chrome.storage.local.set({ wsServerUrl: process.env.SERVER_URL });
  });
});

/** sendMessage를 전달 받았을 경우 실행됩니다. */
chrome.runtime.onMessage.addListener(
  (request: SendMessageRequest<unknown>, sender, sendResponse) => {
    sendResponse(true);

    const { type } = request;
    const [target, title, mode] = type.split(':');

    if (target === 'popup') {
      return handlePopupMessage(title, mode, request);
    }

    if (target === 'content') {
      const tabId = sender.tab?.id as number;

      return handleContentMessage(title, mode, tabId, request);
    }
  }
);
