// Toggle 정보를 storage에서 가져옵니다.
function fetchToggle(tabId: number) {
  return get(tabId).then(({ toggle = false }) => toggle);
}

// 화면 공유 여부를 storage에서 가져옵니다.
function fetchSharing(tabId: number) {
  return get(tabId).then(({ sharing = false }) => sharing);
}

// Active값을 storage에서 가져옵니다.
function fetchActive(tabId: number) {
  return get(tabId).then(({ active = false }) => active);
}

// 참여자 여부를 storage에서 가져옵니다.
function fetchAttendee(tabId: number) {
  return get(tabId).then(({ id = '' }) => id);
}

// TabID값을 tabs에서 가져옵니다.
function fetchTabByQuery(): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs.shift();

      return resolve(!tab ? null : tab);
    });
  });
}

// Toggle Button을 생성합니다. 
async function createToggleButton(tabId: number, isActive: boolean) {
  const body = document.querySelector("body");
  const toggle = await fetchToggle(tabId);

  if (!body) {
    return;
  }

  const div = document.createElement("div");
  div.className = isActive ? `toggle${toggle ? ' on' : ''}` : 'toggle disabled';
  if (isActive) {
    div.addEventListener("click", () =>
      set(tabId, { toggle: div.classList.toggle("on") })
    );
  }
  body.className = "";
  body.appendChild(div);
}

// 에러 메시지를 생성합니다.
function createErrorMessage() {
  const body = document.querySelector("body");

  if (body) {
    const div = document.createElement("div");
    div.innerText = "Google Meet를 선택 후 다시 시도해 주세요.";
    body.className = "error";
    body.appendChild(div);
  }
}

// Popup을 초기화합니다.
async function initialPopup() {
  const tab = await fetchTabByQuery();

  // Google Meet이 아닌 경우 에러메시지를 출력합니다.
  if (!tab || !tab?.id || !tab.url || !tab.url.match(/^https:\/\/meet.google.com\/.*/)) {
    return createErrorMessage();
  }

  const sharing = await fetchSharing(tab.id);
  const active = await fetchActive(tab.id);
  const attendee = await fetchAttendee(tab.id);

  const isActive = (sharing && !!attendee) || (!attendee && active);

  createToggleButton(tab.id, isActive);
}

initialPopup();
log("Updated");