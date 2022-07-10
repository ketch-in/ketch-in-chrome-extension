import message, { MESSAGE_KEY, SOCKET_EVENT, Message } from './message';
import { OrganizerInfo } from './storage';
import Draw from './draw';
import { io, Socket } from 'socket.io-client';

let meetId: string;
let port: chrome.runtime.Port;
let socket: Socket;
const draw = new Draw((drawPoint) => {
  socket.emit(SOCKET_EVENT.DRAW, drawPoint);
});

function initSocket() {
  socket = io(process.env.SERVER_URL as string);

  socket.on(SOCKET_EVENT.CONNECT, () => {
    socket.emit(SOCKET_EVENT.JOIN, meetId);
  });

  socket.on(SOCKET_EVENT.DISCONNECT, () => {});

  socket.on(SOCKET_EVENT.CONNECT_ERROR, () => {
    draw.uninstall();
  });

  socket.on(SOCKET_EVENT.REFETCH, () => {
    port.postMessage({ key: MESSAGE_KEY.REFETCH });
  });

  socket.on(SOCKET_EVENT.UPDATE, (organizerInfo: OrganizerInfo) => {
    port.postMessage({
      key: MESSAGE_KEY.UPDATE,
      payload: organizerInfo,
    });
  });
}

function onDisconnect() {
  // TODO: ketch-in-component 적용, 안내 메시지 수정
  alert('extension이 업데이트 되었습니다. 새로고침 후 다시 접속해주세요.');
}

function onMessage({ key, payload }: Message) {
  if (key === MESSAGE_KEY.CONNECT) {
    meetId = payload as string;
    initSocket();
  }

  if (key === MESSAGE_KEY.REFETCH) {
    const organizerInfo = payload as OrganizerInfo;
    socket.emit(SOCKET_EVENT.UPDATE, meetId, organizerInfo);
  }

  if (key === MESSAGE_KEY.UPDATE) {
    const organizerInfo = payload as OrganizerInfo;
    socket.emit(SOCKET_EVENT.UPDATE, meetId, organizerInfo);
  }

  if (key === MESSAGE_KEY.INSTALL) {
    const organizerId = payload as string;
    draw.install(organizerId);
  }

  if (key === MESSAGE_KEY.UNINSTALL) {
    draw.uninstall();
  }
}

chrome.runtime.onConnect.addListener((_port) => {
  port = _port;

  port.onDisconnect.addListener(onDisconnect);
  port.onMessage.addListener(onMessage);
});

message.get(MESSAGE_KEY.CONNECT);
