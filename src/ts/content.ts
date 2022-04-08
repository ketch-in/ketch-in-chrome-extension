import io from 'socket.io-client';

/** background에서 서버 주소를 전달 받습니다. */
function fetchServerUrl() {
  return sendMessage<string>('content:serverUrl');
}

/** background에서 발표자 정보를 전달 받습니다. */
function fetchOrganizerInfo() {
  return sendMessage<DataInfo>('content:organizer-info');
}

/** socket에서 전달 받은 발표자 정보를 background에 전달합니다. */
function updateOrganizerInfo(organizerInfo: OrganizerInfo) {
  sendMessage('content:organizer-info', organizerInfo);
}

/** 연결 상태를 초기화합니다. */
function initialBackground() {
  sendMessage('content:initial', true);
}

// app scheme을 호출합니다.
function openApp(meetId: string) {
  if (!document.querySelector("iframe[name='app-scheme-frame']")) {
    document.body.appendChild(
      createElement({
        type: 'iframe',
        options: { name: 'app-scheme-frame', style: 'display:none' },
      })
    );
  }
  window.open(`ketch-in://open?id=${meetId}`, 'app-scheme-frame');
  // 발표를 해제 후 다시 발표를 시작했을 때, 앱을 실행시키지 않는 버그가 있어서 추가했습니다.
  window.open(`about:blank`, 'app-scheme-frame');
}

// 화면에 그리기 이벤트를 받을 Layer를 생성합니다.
function createLayer() {
  const target = document.querySelector('#attendee_cover');

  if (target) {
    return target;
  }

  return createElement({
    type: 'div',
    options: {
      id: 'attendee_cover',
      style: `position:absolute;z-index:10;width:100%;height:100%;cursor:url(${chrome.runtime.getURL(
        'draw-icon.png'
      )}), auto;`,
    },
  });
}

/**
 * 식별 Video Element를 반환합니다.
 * @param dataInitialParticipantId video 식별 id
 */
function fetchVideoParentElement(dataInitialParticipantId: string) {
  const div = [
    ...document.querySelectorAll(
      `div[data-initial-participant-id="${dataInitialParticipantId}"]`
    ),
  ].shift();
  if (!div) {
    return null;
  }
  const video = [...div.querySelectorAll('video')]
    .filter((video) => !video.style.display)
    .shift();
  if (!video) {
    return null;
  }
  return video.parentElement;
}

/** 소켓 연결 및 이벤트 처리합니다. */
function wsConnect(url: string) {
  const socket = io(url);
  const googleMeetId = window.location.pathname.slice(1);

  let isDrawing = false;

  const createMouseEvent = (e: MouseEvent, signal: DrawSignal) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const target = e.target as HTMLElement;
    const point: DrawPoint = [
      x,
      y,
      target.clientWidth,
      target.clientHeight,
      signal,
    ];

    socket.emit('draw:add', googleMeetId, point);
  };

  const mousedown = (e: MouseEvent) => {
    createMouseEvent(e, 'down');
    isDrawing = true;
  };

  const mousemove = (e: MouseEvent) => {
    if (isDrawing === true) {
      createMouseEvent(e, 'move');
    }
  };

  const mouseup = (e: MouseEvent) => {
    if (isDrawing === true) {
      createMouseEvent(e, 'up');
      isDrawing = false;
    }
  };

  const attendeeInstall = (parentElement: HTMLElement) => {
    const cover = createLayer();

    cover.addEventListener('mousedown', mousedown as EventListener);
    cover.addEventListener('mousemove', mousemove as EventListener);
    window.addEventListener('mouseup', mouseup);
    parentElement.appendChild(cover);
  };

  const attendeeUninstall = () => {
    const cover = createLayer();

    window.removeEventListener('mouseup', mouseup);

    if (cover.parentElement) {
      cover.parentElement.removeChild(cover);
    }
  };

  const emitOrganizerInfo = () => {
    fetchOrganizerInfo().then(({ attendee, organizer }) => {
      const { target = 'other', toggle } = attendee || {};

      // 발표자인 경우 active값을 변경하면서 organizer 값을 갱신합니다.
      if (target === 'self') {
        socket.emit('organizer-info:update', googleMeetId, organizer);
      }

      //toggle의 활성화 여부에 따라 화면 그리기 동작을 추가 여부를 지정합니다.
      if (!toggle) {
        return attendeeUninstall();
      }

      if (!organizer.id) {
        return socket.emit('join', googleMeetId);
      }

      // toggle 값을 사용자가 활성화 했으나 화면이 존재하지 않으면 false처리합니다.
      const targetElement = fetchVideoParentElement(organizer.id);

      if (!targetElement) {
        return socket.emit('join', googleMeetId);
      }
      return attendeeInstall(targetElement);
    });
  };

  /** 서버와 연결되었을 때, Google Meet 고유 식별 코드를 전달합니다. */
  socket.on('connect', () => {
    socket.emit('join', googleMeetId);
    initialBackground();
  });

  /** 연결이 끊어진 경우 발표자가 아닌경우 데이터를 초기화하고 재연결을 시도합니다. */
  socket.on('disconnect', (reason: string) => {
    initialBackground();
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  /** 연결을 할 수 없는 상황인 경우 발표자가 아닌경우에만 데이터를 초기화합니다. */
  socket.on('connect_error', initialBackground);

  /** organizer 정보를 재 요청시 발표자인 경우 재 응답합니다. */
  socket.on('organizer-info:refetch', emitOrganizerInfo);

  /** organizer 정보가 업데이트 되었을 경우 업데이트합니다. */
  socket.on('organizer-info:update', updateOrganizerInfo);

  chrome.runtime.onMessage.addListener((request) => {
    const { type, message } = request;

    const [target, title, mode] = type.split(':');

    if (target !== 'content') {
      return;
    }

    if (title === 'toggle' && mode === 'set') {
      return emitOrganizerInfo();
    }

    if (title === 'id' && mode === 'set') {
      if (message?.organizer?.id) {
        openApp(googleMeetId);
      }
      return emitOrganizerInfo();
    }
  });
}

function initialContent() {
  handshaking('content')
    .then((result) => {
      if (!result) {
        return;
      }

      fetchServerUrl().then(wsConnect);
    })
    .catch(() => {
      setTimeout(initialContent, 3000);
    });
}

initialContent();
