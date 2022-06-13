import { STATE, TARGET } from './constants';

type Storage = {
  state: STATE;
  meetId: string;
  organizerId: string | null;
  active: boolean;
  target: TARGET;
  toggle: boolean;
};

type OrganizerInfo = {
  id: string | null;
  active: boolean;
};

const INITIAL_STORAGE: Storage = {
  state: STATE.PENDING,
  meetId: '',
  organizerId: null,
  active: true,
  target: TARGET.OTHER,
  toggle: true,
} as const;

async function get<T extends keyof Storage>(
  tabId: number,
  key: T
): Promise<Storage[T]> {
  const storages = await chrome.storage.local.get(tabId.toString());
  const storage = storages[tabId];

  return storage[key];
}

async function set(tabId: number, data: Partial<Storage>) {
  const storages = await chrome.storage.local.get(tabId.toString());
  const storage = storages[tabId];

  return chrome.storage.local.set({
    [tabId]: {
      ...storage,
      ...data,
    },
  });
}

function init(tabId: number, meetId: string) {
  return chrome.storage.local.set({
    [tabId]: {
      ...INITIAL_STORAGE,
      meetId: meetId,
    },
  });
}

function remove(tabId: number) {
  return chrome.storage.local.remove(tabId.toString());
}

async function getOrganizerInfo(tabId: number): Promise<OrganizerInfo> {
  const storages = await chrome.storage.local.get(tabId.toString());
  const storage = storages[tabId] as Storage;

  return {
    id: storage.organizerId,
    active: storage.active,
  };
}

export { STATE, TARGET, Storage, OrganizerInfo };

export default {
  get,
  getOrganizerInfo,
  set,
  init,
  remove,
};
