import {
  ResolveMeetingSpace,
  CreateMeetingDevice,
  UpdateMeetingDevice,
} from './message';

interface ResolveMeetingSpaceResponse {
  meetId: string;
}

interface CreateMeetingDeviceResponse {
  participantId: string;
  nickname: string;
  imageUrl: string;
}

interface UpdateMeetingDeviceResponse extends CreateMeetingDeviceResponse {}

const decoderMap = {
  ['ResolveMeetingSpace']: ResolveMeetingSpace,
  ['CreateMeetingDevice']: CreateMeetingDevice,
  ['UpdateMeetingDevice']: UpdateMeetingDevice,
};

type DecoderMap = typeof decoderMap;
export type Key = keyof DecoderMap;
type Decoded<T extends Key> = T extends 'ResolveMeetingSpace'
  ? ResolveMeetingSpaceResponse
  : T extends 'CreateMeetingDevice'
  ? CreateMeetingDeviceResponse
  : T extends 'UpdateMeetingDevice'
  ? UpdateMeetingDeviceResponse
  : never;

export function decodeProtobuf<T extends Key>(key: T, buffer: Uint8Array) {
  const decoder = decoderMap[key];
  return decoder.decode(buffer).toJSON() as Decoded<T>;
}
