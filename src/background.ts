import { MESSAGE_KEY, Message } from './message';
import storage, { TARGET, OrganizerInfo } from './storage';
import observer from './observer';

const ports: { [tabId: string]: chrome.runtime.Port } = {};

async function onContentMessage(tabId: number, { key, payload }: Message) {
  const port = ports[tabId];

  if (key === MESSAGE_KEY.REFETCH) {
    const target = await storage.get(tabId, 'target');
    if (target === TARGET.SELF) {
      const organizerInfo = await storage.getOrganizerInfo(tabId);

      port.postMessage({
        key: MESSAGE_KEY.REFETCH,
        payload: organizerInfo,
      });
    }
  }

  if (key === MESSAGE_KEY.UPDATE) {
    const organizerInfo = payload as OrganizerInfo;
    const { id, active } = organizerInfo;

    storage.set(tabId, {
      organizerId: id,
      active: active,
      target: TARGET.OTHER,
    });

    if (id === null) {
      ports[tabId].postMessage({ key: MESSAGE_KEY.UNINSTALL });
    }

    if (active) {
      ports[tabId].postMessage({
        key: MESSAGE_KEY.INSTALL,
        payload: id,
      });
    } else {
      ports[tabId].postMessage({ key: MESSAGE_KEY.UNINSTALL });
    }
  }
}

async function onPopupMessage({ key, payload }: Message) {
  // popup에서 온 message event에는 tab정보가 없으므로 활성화된 tab을 가져옴.
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0]) {
    return;
  }

  const tab = tabs[0];
  const tabId = tab?.id as number;

  if (key === MESSAGE_KEY.URL) {
    return tab?.url as string;
  }

  if (key === MESSAGE_KEY.TARGET) {
    const target = await storage.get(tabId, 'target');
    return target;
  }

  // meet에서 누군가 발표 중이어야 토글 버튼이 활성화 됨.
  if (key === MESSAGE_KEY.ENABLED) {
    const enabled = await storage.get(tabId, 'organizerId');
    return enabled;
  }

  if (key === MESSAGE_KEY.ACTIVE) {
    if (payload === undefined) {
      const active = await storage.get(tabId, 'active');
      return active;
    }

    const active = payload as boolean;
    storage.set(tabId, { active: active });

    const organizerId = await storage.get(tabId, 'organizerId');
    ports[tabId].postMessage({
      key: MESSAGE_KEY.UPDATE,
      payload: {
        id: organizerId,
        active: active,
      },
    });
  }

  if (key === MESSAGE_KEY.TOGGLE) {
    if (payload === undefined) {
      const toggle = await storage.get(tabId, 'toggle');
      return toggle;
    }

    const toggle = payload as boolean;
    storage.set(tabId, { toggle: toggle });
    const organizerId = await storage.get(tabId, 'organizerId');
    if (toggle) {
      ports[tabId].postMessage({
        key: MESSAGE_KEY.INSTALL,
        payload: organizerId,
      });
    } else {
      ports[tabId].postMessage({ key: MESSAGE_KEY.INSTALL });
    }
  }
}

// meet에 들어간 상태에서 extension을 새로 설치한 경우 재접속 안내
async function onInstalled() {
  const tabs = await chrome.tabs.query({
    url: 'https://meet.google.com/*',
  });

  tabs
    .map((tab) => tab.id as number)
    .forEach((tabId) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          // TODO: ketch-in-components 적용, 메시지 수정
          alert(
            'Ketch-in이 설치되었습니다. 이용하려면 새로고침후 다시 접속해주세요.'
          );
        },
      });
    });
}

// 참여, 참여 종료, 발표, 발표 종료를 감지.
observer.observe({
  onParticipationStart(tabId) {
    storage.get(tabId, 'meetId').then((meetId) => {
      ports[tabId].postMessage({
        key: MESSAGE_KEY.CONNECT,
        payload: meetId,
      });
    });
  },

  onParticipationStop(tabId) {
    storage.remove(tabId);
  },

  onPresentationStart(tabId) {
    storage.getOrganizerInfo(tabId).then((organizerInfo) => {
      ports[tabId].postMessage({
        key: MESSAGE_KEY.INSTALL,
        payload: organizerInfo.id,
      });

      ports[tabId].postMessage({
        key: MESSAGE_KEY.UPDATE,
        payload: organizerInfo,
      });

      storage.get(tabId, 'meetId').then((meetId) => {
        ports[tabId].postMessage({
          key: MESSAGE_KEY.RUN,
          payload: meetId,
        });
      });
    });
  },

  onPresentationStop(tabId: number) {
    storage
      .set(tabId, {
        organizerId: null,
        target: TARGET.OTHER,
      })
      .then(() => {
        ports[tabId].postMessage({ key: MESSAGE_KEY.UNINSTALL });

        ports[tabId].postMessage({
          key: MESSAGE_KEY.UPDATE,
          payload: { id: null },
        });
      });
  },
});

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    // sender에 tab 정보가 있으면 content에서 온 message
    if (typeof sender?.tab?.id === 'number') {
      if (message.key === MESSAGE_KEY.CONNECT) {
        const tabId = sender.tab.id;
        const port = chrome.tabs.connect(tabId);

        port.onMessage.addListener((message) => {
          onContentMessage(tabId, message);
        });

        ports[tabId] = port;
      }
    } else {
      onPopupMessage(message).then(sendResponse);

      return true;
    }
  }
);

chrome.tabs.onRemoved.addListener((tabId) => {
  storage.remove(tabId);
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    onInstalled();
  }
});
