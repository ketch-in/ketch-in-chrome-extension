importScripts("common.js");
importScripts("server.js");

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

  if (!url.match(/(.*\/UpdateMeeting)(Space|Device)$/) || !requestBody || !requestBody?.raw) {
    return;
  }
  const raw = requestBody.raw.shift();
  if (!raw || !raw.bytes) {
    return;
  }

  const decoder = new TextDecoder("utf-8");
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
    set(tabId, { id: dataInitialParticipantId, active: false, toggle: false, sharing: true }).then(() =>
      log("발표가 시작되었습니다.")
    );
  }

  // 발표가 종료됩니다. (UpdateMeetingDevice)
  get(tabId).then((data) => {
    if (data?.id === dataInitialParticipantId && /^\nD/.test(payload)) {
      reset(tabId).then(() =>
        log("발표가 종료되었습니다.")
      );
    }
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear(() => {

    chrome.storage.local.set({ wsServerUrl: SERVER_URL }).then(() => {
      log("Installed");
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type } = request;

  // Tab 정보를 반환합니다.
  if (type === "extension:fetchTabId" && sender?.tab?.id) {
    return sendResponse(sender.tab.id);
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  fetchOrganizer,
  { urls: ["https://meet.google.com/*"] },
  ["requestBody"]
);