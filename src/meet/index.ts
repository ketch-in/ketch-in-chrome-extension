import { decodeProtobuf, Key } from './protobuf';

interface Detail {
  url: string;
  body: string;
}

interface Callback {
  (state: Partial<State>): void;
}

interface Config {
  onParticipationStart?: Callback;
  onParticipationEnd?: Callback;
  onPresentationStart?: Callback;
  onPresentationEnd?: Callback;
}

interface State {
  state: 'pending' | 'participating';
  participantId: string;
  presenterId: string;
  nickname: string;
  imageUrl: string;
  meetId: string;
}

const state: State = {
  state: 'pending',
  participantId: '',
  presenterId: '',
  nickname: '',
  imageUrl: '',
  meetId: '',
};

/** fetch API를 변경하는 스크립트를 DOM에 삽입합니다. */
function injectPatchScript() {
  const scriptEl = document.createElement('script');
  scriptEl.src = chrome.runtime.getURL('fetch-interceptor.js');
  scriptEl.addEventListener('load', scriptEl.remove);

  (document.head || document.documentElement).appendChild(scriptEl);
}

function base64ToArrayBuffer(base64Data: string) {
  const str = window.atob(base64Data);
  const arrayBuffer = new ArrayBuffer(str.length);
  const arrayBufferView = new Uint8Array(arrayBuffer);
  for (let i = 0; i < str.length; i++) {
    arrayBufferView[i] = str.charCodeAt(i);
  }

  return arrayBufferView;
}

function handleResponse(key: Key, body: string, config: Config) {
  const buffer = base64ToArrayBuffer(body);

  switch (key) {
    case 'ResolveMeetingSpace': {
      const response = decodeProtobuf(key, buffer);
      state.meetId = response.meetId;

      break;
    }
    case 'CreateMeetingDevice': {
      const response = decodeProtobuf(key, buffer);
      if (state.state === 'pending') {
        state.participantId = response.participantId;
        state.nickname = response.nickname;
        state.imageUrl = response.imageUrl;

        break;
      }

      break;
    }
    case 'UpdateMeetingDevice': {
      const response = decodeProtobuf(key, buffer);
      if (state.presenterId === response.participantId) {
        config.onPresentationEnd?.({
          presenterId: state.presenterId,
        });
        state.presenterId = '';

        break;
      }

      if (state.state === 'pending') {
        config.onParticipationStart?.({
          participantId: state.participantId,
          nickname: state.nickname,
          imageUrl: state.imageUrl,
        });
        state.state = 'participating';

        break;
      }

      if (state.participantId === response.participantId) {
        config.onParticipationEnd?.({
          participantId: state.participantId,
        });
        state.state = 'pending';
        state.participantId = '';

        break;
      }

      if (state.presenterId === '') {
        config.onPresentationStart?.({
          presenterId: response.participantId,
        });
        state.presenterId = response.participantId;

        break;
      }

      break;
    }
  }
}

/** meet의 http response를 모니터링합니다. */
export default function initNetworkMonitoring(config: Config) {
  document.addEventListener('response', (e: CustomEventInit<Detail>) => {
    if (!e.detail) {
      return;
    }

    const keys: Key[] = [
      'ResolveMeetingSpace',
      'CreateMeetingDevice',
      'UpdateMeetingDevice',
    ];
    const { url, body } = e.detail;
    const key = keys.find((key) => url.includes(key));
    if (key) {
      handleResponse(key, body, config);
    }
  });

  injectPatchScript();
}
