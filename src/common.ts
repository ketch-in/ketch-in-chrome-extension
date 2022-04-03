/* eslint-disable @typescript-eslint/no-unused-vars */

interface Socket {
  emit(ev: string, ...args: unknown[]): Socket;
}

interface Data {
  target: "self" | "other";
  toggle: boolean;
  organizer: OrganizerInfo
}

interface OrganizerInfo {
  id?: string | null;
  active?: boolean;
  toggle?: boolean;
  sharing?: boolean;
}

type ChangedData = { [key: string]: chrome.storage.StorageChange; }
type DrawSignal = "up" | "down" | "move";
type DrawPoint = [x: number, y: number, width: number, height: number, signal: DrawSignal];

// TabId에 해당하는 기본값을 반환합니다.
function initData(): OrganizerInfo {
  return {
    id: "",
    active: false,
    toggle: false,
    sharing: false,
  }
}

// localStorage에서 tabId에 해당하는 값을 반환합니다.
function get(tabId: number): Promise<OrganizerInfo> {
  try {
    return new Promise((resolve) =>
      chrome.storage.local.get(`${tabId}`, (items) =>
        resolve(items[`${tabId}`] || {})
      )
    );
  } catch {
    return new Promise((resolve) => resolve(initData()));
  }
}

// localStorage에서 수정한 값만 수정하여 저장합니다.
function set(tabId: number, newData: OrganizerInfo) {
  return get(tabId).then((data) =>
    chrome.storage.local.set({ [`${tabId}`]: { ...data, ...newData } })
  );
}

// localStorage에서 기본 값으로 수정하여 저장합니다.
function reset(tabId: number) {
  return set(tabId, initData())
}

// tabId 하위 값에 대한 new/oldValue 값을 반환합니다.
function changed(tabId: number, changes: ChangedData): ChangedData | null {
  if (!changes[`${tabId}`]) {
    return null;
  }

  const newData = changes[`${tabId}`].newValue;
  const oldData = changes[`${tabId}`].oldValue || {};
  const keys = Object.keys(newData);

  return keys.filter((key) =>
    newData[key] !== oldData[key]
  ).reduce(
    (data, key) => (
      { ...data, [key]: { newValue: newData[key], oldValue: oldData[key] } }
    ), {}
  );
}

/**
 * 콘솔창에 로그를 출력합니다.
 * @param msg 출력할 메시지
 * @param color 메시지 컬러
 */
function log(msg: unknown, color = '#07D97A') {
  console.trace('%c[KETCH IN] %c%o', 'color: #0895FE', `color: ${color}`, msg)
}
