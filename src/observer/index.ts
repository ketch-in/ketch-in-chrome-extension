import {
  MEET_URL,
  REQUEST_BODY,
  REQUEST_HEADERS,
  EXTRA_HEADERS,
  RESOLVE_MEETING_SPACE,
  UPDATE_MEETING_DEVICE,
  REQUEST_TYPE,
  DIRECT_PARTICIPATION,
} from './constants';
import storage, { STATE, TARGET } from '../storage';

interface Callbacks {
  onParticipationStart?: (tabId: number) => void;
  onParticipationStop?: (tabId: number) => void;
  onPresentationStart?: (tabId: number) => void;
  onPresentationStop?: (tabId: number) => void;
}

const requestFilter = { urls: [MEET_URL] };
const onBeforeRequestOptions = [REQUEST_BODY];
const onBeforeSendHeadersOptions = [REQUEST_HEADERS, EXTRA_HEADERS];

function decodeArrayBuffer(ab: ArrayBuffer) {
  const decoder = new TextDecoder();
  return decoder.decode(ab);
}

async function onBeforeRequest(
  tabId: number,
  body: string,
  callbacks: Callbacks
) {
  const matches = /(`|D)[^spaces]*(spaces\/[^\/]+\/devices\/[^\s]+)/.exec(body);
  if (!matches) {
    return;
  }

  const state = await storage.get(tabId, 'state');
  const [, requestType, organizerId] = matches;
  if (requestType === REQUEST_TYPE.START) {
    if (state === STATE.PENDING) {
      await storage.set(tabId, { state: STATE.PARTICIPATING });
      callbacks.onParticipationStart?.(tabId);

      return;
    }

    if (state === STATE.PARTICIPATING) {
      await storage.set(tabId, {
        state: STATE.PRESENTING,
        organizerId: organizerId,
        active: true,
        target: TARGET.SELF,
      });

      callbacks.onPresentationStart?.(tabId);

      return;
    }
  }

  if (requestType === REQUEST_TYPE.STOP) {
    if (state === STATE.PARTICIPATING) {
      await storage.set(tabId, { state: STATE.PENDING });
      callbacks.onParticipationStop?.(tabId);

      return;
    }

    if (state === STATE.PRESENTING) {
      await storage.set(tabId, {
        state: STATE.PARTICIPATING,
        organizerId: null,
        target: TARGET.OTHER,
      });
      callbacks.onPresentationStop?.(tabId);

      return;
    }
  }
}

async function onBeforeSendHeaders(
  tabId: number,
  referer: string,
  callbacks: Callbacks
) {
  const matches = /meet.google.com\/(_meet\/)?([^?]+)/.exec(referer);
  if (!matches) {
    return;
  }

  const [, _meet, meetId] = matches;
  await storage.init(tabId, meetId);

  const isDirectParticipation = _meet === DIRECT_PARTICIPATION;
  if (isDirectParticipation) {
    await storage.set(tabId, { state: STATE.PARTICIPATING });
    callbacks.onParticipationStart?.(tabId);
  }
}

/**
 * meet의 request를 모니터링.
 * @param callbacks 참여 시작, 참여 끝, 발표 시작, 발표 끝에 동작할 callback 함수.
 */
function observe(callbacks: Callbacks) {
  chrome.webRequest.onBeforeRequest.addListener(
    ({ tabId, url, requestBody }) => {
      if (tabId === -1) {
        return;
      }

      if (!url.includes(UPDATE_MEETING_DEVICE)) {
        return;
      }

      if (!requestBody || !requestBody?.raw || !requestBody.raw[0].bytes) {
        return;
      }

      const decoded = decodeArrayBuffer(requestBody.raw[0].bytes);
      onBeforeRequest(tabId, decoded, callbacks);
    },
    requestFilter,
    onBeforeRequestOptions
  );

  chrome.webRequest.onBeforeSendHeaders.addListener(
    ({ tabId, url, requestHeaders }) => {
      if (tabId === -1) {
        return;
      }

      if (!url.includes(RESOLVE_MEETING_SPACE)) {
        return;
      }

      if (!requestHeaders) {
        return;
      }

      const referer = requestHeaders.find((h) => h.name === 'Referer')?.value;
      if (!referer) {
        return;
      }

      onBeforeSendHeaders(tabId, referer, callbacks);
    },
    requestFilter,
    onBeforeSendHeadersOptions
  );
}

export default {
  observe,
};
