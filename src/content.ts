const data: Data = {
  target: 'other',
  toggle: false,
  organizer: {},
}
const id = fetchID();

let socket: Socket = {
  emit: (ev: string, ...args: unknown[]) => {
    console.log(ev, args); return socket
  }
};
let isDrawing = false;

const createMouseEvent = (e: MouseEvent, signal: DrawSignal) => {
  const x = e.offsetX;
  const y = e.offsetY;
  const target = e.target as HTMLElement;
  const point: DrawPoint = [x, y, target.clientWidth, target.clientHeight, signal]

  socket.emit("draw:add", id, point);
}

const mousedown = (e: MouseEvent) => {
  createMouseEvent(e, "down");
  isDrawing = true;
}

const mousemove = (e: MouseEvent) => {
  if (isDrawing === true) {
    createMouseEvent(e, "move");
  }
}

const mouseup = (e: MouseEvent) => {
  if (isDrawing === true) {
    createMouseEvent(e, "up");
    isDrawing = false;
  }
}

/**
 * 식별 Video Element를 반환합니다.
 * @param dataInitialParticipantId video 식별 id
 */
function fetchVideoParentElement(dataInitialParticipantId: string) {
  const div = [...document.querySelectorAll(`div[data-initial-participant-id="${dataInitialParticipantId}"]`)].shift();
  if (!div) {
    return null;
  }
  const video = [...div.querySelectorAll("video")].filter((video) =>
    !video.style.display
  ).shift();
  if (!video) {
    return null;
  }
  return video.parentElement;
}

// storage에서 Web Server URL을 가져옵니다.
function fetchServerUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get("wsServerUrl", ({ wsServerUrl }) =>
      resolve(wsServerUrl)
    );
  })
}

// Background에서 Tab ID값을 가져옵니다.
function fetchTabId(): Promise<number> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "extension:fetchTabId" }, resolve);
  })
}

// Google Meet의 ID 값을 가져옵니다.
function fetchID() {
  return window.location.pathname.slice(1);
}

// app scheme을 호출합니다.
function openApp(meetId: string) {
  log("앱 스킴을 호출합니다.");
  if (!document.querySelector("iframe[name='app-scheme-frame']")) {
    const subFrame = document.createElement("iframe");
    subFrame.setAttribute("name", "app-scheme-frame");
    subFrame.setAttribute("style", "display:none");
    document.body.appendChild(subFrame);
  }
  window.open(`ketch-in://open?id=${meetId}`, "app-scheme-frame");
  // 발표를 해제 후 다시 발표를 시작했을 때, 앱을 실행시키지 않는 버그가 있어서 추가했습니다.
  window.open(`about:blank`, "app-scheme-frame");
}

// WebSocket Server와 연결합니다.
function wsConnect(url: string, tabId: number) {
  const socket = io(url);

  // 서버와 연결되었을 때, Google Meet 고유 식별 코드를 전달합니다.
  socket.on("connect", () => {
    socket.emit("join", id);

    log("socket 서버와 연결되었습니다.");
  });

  /** 연결이 끊어진 경우 발표자가 아닌경우 데이터를 초기화하고 재연결을 시도합니다. */
  socket.on("disconnect", (reason: string) => {
    if (data.target !== "self") {
      data.toggle = false;
      data.organizer.id = null;
      data.organizer.active = false;
    }
    log("socket 서버와 해제되었습니다.");
    if (reason === "io server disconnect") {
      log("socket 서버와 재 연결중입니다.");
      socket.connect();
    }
  });

  // 연결을 할 수 없는 상황인 경우 발표자가 아닌경우에만 데이터를 초기화합니다.
  socket.on("connect_error", (error) => {
    if (data.target !== "self") {
      data.toggle = false;
      data.organizer.id = null;
      data.organizer.active = false;
    }
    log(`${id} > socket 서버와 연결할 수 없습니다.\n("${error}")`, "red")
  });

  /** organizer 정보를 재 요청시 발표자인 경우 재 응답합니다. */
  socket.on("organizer-info:refetch", function () {
    log(`organizer-info:refetch > ${JSON.stringify(data)}`);
    if (data.target === "self") {
      socket.emit("organizer-info:update", id, data.organizer);
      log("데이터 요청이 발생하여 전달하였습니다.");
    }
  });

  // organizer 정보가 업데이트 되었을 경우 업데이트합니다.
  socket.on("organizer-info:update", function (organizerInfo: OrganizerInfo) {
    log(`organizer-info:update > ${JSON.stringify(data)}`);
    if (data.target !== "self") {
      data.organizer = organizerInfo;
      set(tabId, { toggle: false, active: organizerInfo.active, sharing: !!organizerInfo?.id }).then(() =>
        log("organizerInfo 정보가 업데이트 되었습니다.")
      );
    }
  });
  return socket;
}

// 화면에 그리기 이벤트를 받을 Layer를 생성합니다.
function createLayer() {
  const target = document.querySelector("#attendee_cover");
  if (target) {
    return target;
  }

  const cover = document.createElement("div");
  cover.id = "attendee_cover";
  cover.style.position = "absolute";
  cover.style.zIndex = "10";
  cover.style.width = "100%";
  cover.style.height = "100%";
  cover.style.cursor = `url(${chrome.runtime.getURL("draw-icon.png")}), auto`;

  return cover;
}

function attendeeInstall(parentElement: HTMLElement) {
  const cover = createLayer();

  cover.addEventListener('mousedown', mousedown as EventListener);
  cover.addEventListener('mousemove', mousemove as EventListener);
  window.addEventListener('mouseup', mouseup);
  parentElement.appendChild(cover);

  log("attendee가 설정되었습니다.");
}

function attendeeUninstall() {
  const cover = createLayer();

  window.removeEventListener('mouseup', mouseup);

  if (cover.parentElement) {
    cover.parentElement.removeChild(cover);
  }
  log("attendee가 제거되었습니다.");
}

function handleChangeID(dataInitialParticipantId: string) {
  data.toggle = false;
  data.organizer.id = dataInitialParticipantId;
  data.organizer.active = false;
  data.target = data.organizer.id ? "self" : "other";

  log(`id 값이 변경되었습니다. ${dataInitialParticipantId}`);

  socket.emit("organizer-info:update", dataInitialParticipantId, data.organizer);
  if (data.organizer.id) {
    openApp(id);
  }
}

function handleChangeToggle(toggle: boolean) {
  log(`toggle 값이 변경되었습니다. ${toggle}`);
  data.toggle = toggle;
  // 발표자인 경우 active값을 변경하면서 organizer 값을 갱신합니다.
  if (data.target === "self") {
    data.organizer.active = toggle;
    socket.emit("organizer-info:update", id, data.organizer);
  }

  //toggle의 활성화 여부에 따라 화면 그리기 동작을 추가 여부를 지정합니다.
  if (!toggle) {
    return attendeeUninstall();
  }

  if (!data?.organizer?.id) {
    return socket.emit("join", id);
  }

  // toggle 값을 사용자가 활성화 했으나 화면이 존재하지 않으면 false처리합니다.
  const targetElement = fetchVideoParentElement(data.organizer.id);
  if (!targetElement) {
    return socket.emit("join", id);
  }
  return attendeeInstall(targetElement);
}

// content를 실행합니다.
async function initialContent() {
  const url = await fetchServerUrl();
  const tabId = await fetchTabId();

  socket = wsConnect(url, tabId);

  chrome.storage.onChanged.addListener((changes) => {
    const change = changed(tabId, changes);

    if (!change) {
      return;
    }

    // Video 식별 ID값이 변경되었을 경우, 발표자로 인식하여 데이터를 업데이트합니다.
    if (change?.id) {
      handleChangeID(change.id.newValue);
    }

    // toggle 값이 변경되었을 경우, 발표자, 참여자에 따라 동작합니다.
    if (change?.toggle) {
      handleChangeToggle(change.toggle.newValue);
    }
  });
}

initialContent();
log("loaded");