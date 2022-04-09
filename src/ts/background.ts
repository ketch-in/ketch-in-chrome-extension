import '@ts/common';

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

/** 발표를 시작했을 경우 호출됩니다. */
async function startOrganizer(tabId: number, dataInitialParticipantId: string) {
  await storage(tabId, 'organizer', {
    id: dataInitialParticipantId,
    active: false,
    toggle: false,
  });
  await storage(tabId, 'attendee', { target: 'self' });
  await contentSendMessage(tabId, 'content:id');
}

/** 발표를 중단했을 경우 호출됩니다. */
async function stopOrganizer(tabId: number) {
  await storage(tabId, 'organizer', emptyOrganizer);
  await storage(tabId, 'attendee', { target: 'other' });
  await contentSendMessage(tabId, 'content:id');
}

/**
 * 발표자 모드를 조건에 따라 활성화합니다.
 * 1. UpdateMeetingSpace 값에 B가 있는 경우 활성화됩니다.
 * 2. UpdateMeetingDevice 값에 D가 있고 target 값이 self이며, 발표자의 ID와 응답값의 ID가 같은 경우 비활성화됩니다.
 */
function fetchOrganizer(details: chrome.webRequest.WebRequestBodyDetails) {
  const { url, tabId, requestBody } = details;

  // -1 Tab과 무관한 값일 경우 발생
  // The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  if (tabId === -1) {
    return;
  }

  if (
    !url.match(/(.*\/UpdateMeeting)(Space|Device)$/) ||
    !requestBody ||
    !requestBody?.raw
  ) {
    return;
  }
  const raw = requestBody.raw.shift();
  if (!raw || !raw.bytes) {
    return;
  }

  const decoder = new TextDecoder('utf-8');
  const payload = decoder.decode(new Uint8Array(raw.bytes));
  const result = payload.match(/@spaces\/[\w-]+\/devices\/[\w-]+/g);
  if (!result) {
    return;
  }

  const targetData = result.shift();
  if (!targetData) {
    return;
  }

  const dataInitialParticipantId = targetData.slice(1);
  if (!dataInitialParticipantId) {
    return;
  }

  // 발표를 시작합니다. (UpdateMeetingSpace)
  if (/\nB\n@spaces/.test(payload)) {
    startOrganizer(tabId, dataInitialParticipantId);
    return;
  }

  // 발표가 종료됩니다. (UpdateMeetingDevice)
  storage(tabId, 'organizer').then(({ id }) => {
    if (id === dataInitialParticipantId && /^\nD/.test(payload)) {
      stopOrganizer(tabId);
    }
  });
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

/** Network를 감시합니다. */
chrome.webRequest.onBeforeRequest.addListener(
  fetchOrganizer,
  { urls: ['https://meet.google.com/*'] },
  ['requestBody']
);
