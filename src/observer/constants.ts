export const MEET_URL = 'https://meet.google.com/*';

export const REQUEST_BODY = 'requestBody';
export const REQUEST_HEADERS = 'requestHeaders';
export const EXTRA_HEADERS = 'extraHeaders';

/** 관찰 할 request url name. */
export const RESOLVE_MEETING_SPACE = 'ResolveMeetingSpace';
export const UPDATE_MEETING_DEVICE = 'UpdateMeetingDevice';

export enum REQUEST_TYPE {
  START = '`',
  STOP = 'D',
}

/** meet 홈에서 생성과 동시에 입장하는 경우 처리를 위한 값 */
export const DIRECT_PARTICIPATION = '_meet/';
