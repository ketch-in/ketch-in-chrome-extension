import message, { MESSAGE_KEY, RTC_EVENT, Message } from './message';
import { OrganizerInfo } from './storage';
import Draw from './draw';

//@ts-ignore
import RTCMultiConnection from 'rtcmulticonnection';
import { io } from 'socket.io-client';

//@ts-ignore
window.io = io;

const { DRAW } = RTC_EVENT;
const { RUN, CONNECT, UPDATE, INSTALL, REFETCH, UNINSTALL } = MESSAGE_KEY;

type createElProps = {
  type: string;
  options?: { [key: string]: string };
  children?: Element | string | (Element | string)[];
};

type El = Element & {
  createElement?: (args: createElProps) => El;
};

//@ts-ignore
const connection = new RTCMultiConnection();
const draw = new Draw((drawPoint) =>
  connection.send({ key: DRAW, payload: drawPoint })
);

/**
 * Element를 생성합니다.
 */
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

function openRoom(meetId: string, done: (joined: boolean) => void) {
  connection.open(
    meetId,
    (isRoomOpened: boolean, id: string, error?: string) => {
      if (!error) {
        console.log('WebRTC > 연결됨.');
        return done(true);
      }

      // 이미 방이 생성된 상태라면 가입을 시도합니다.
      if (error === connection.errors.ROOM_NOT_AVAILABLE) {
        return joinRoom(meetId, done);
      }

      done(false);
      connection.onerror(error);
    }
  );
}

function joinRoom(meetId: string, done: (joined: boolean) => void) {
  connection.sessionid = meetId;
  connection.isInitiator = false;
  connection.join(
    meetId,
    (isRoomJoined: boolean, roomId: string, error?: string) => {
      if (!error) {
        console.log('WebRTC > 연결됨.');
        return done(true);
      }

      done(false);
      connection.onerror(error);
    }
  );
}

function onDisconnect() {
  // TODO: ketch-in-component 적용, 안내 메시지 수정
  alert('extension이 업데이트 되었습니다. 새로고침 후 다시 접속해주세요.');
}

function onConnect(meetId: string, port: chrome.runtime.Port) {
  connection.socketURL = 'https://ketchin.fly.dev/';
  connection.socketMessageEvent = 'data-sharing';
  connection.chunkSize = 60 * 1000;
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false,
  };
  connection.session = { data: true };

  connection.onerror = (...args: any[]) => {
    console.log('WebRTC > 오류발생 > ', ...args);
    draw.uninstall();
  };
  connection.onmessage = (event: any) => {
    console.log('message 수신!', event?.data?.key, event?.data?.payload);
    port.postMessage(event?.data);
  };
  connection.checkPresence(meetId, (isRoomExist: boolean) =>
    (isRoomExist ? joinRoom : openRoom)(meetId, (joined: boolean) => {
      if (joined) {
        connection.send({ key: REFETCH });
      }
    })
  );
  connection.socket.on('disconnect', function () {
    connection.onerror('disconnect');
  });
}

function onMessage({ key, payload }: Message, port: chrome.runtime.Port) {
  console.log({ key, payload });
  if (key === CONNECT) {
    const meetId = payload as string;
    return onConnect(meetId, port);
  }
  if (key === UPDATE) {
    const organizerInfo = payload as OrganizerInfo;
    return connection.send({
      key: UPDATE,
      payload: organizerInfo,
    });
  }
  if (key === RUN) {
    const meetId = payload as string;
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
    return window.open(`about:blank`, 'app-scheme-frame');
  }
  if (key === INSTALL) {
    const organizerId = payload as string;
    return draw.install(organizerId);
  }
  if (key === UNINSTALL) {
    return draw.uninstall();
  }
  console.log('no catch > ', key, payload);
}

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(onDisconnect);
  port.onMessage.addListener((message) => onMessage(message, port));
});

message.get(CONNECT);
