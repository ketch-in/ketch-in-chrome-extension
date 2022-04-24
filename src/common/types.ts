export type createElProps = {
  type: string;
  options?: { [key: string]: string };
  children?: Element | string | (Element | string)[];
};

export type El = Element & {
  createElement?: (args: createElProps) => El;
};

export type SendMessageRequest<T> = {
  type: string;
  message: T;
};

export interface OrganizerInfo {
  id?: string | null;
  active?: boolean;
  toggle?: boolean;
}

export interface AttendeeInfo {
  target?: 'self' | 'other';
  toggle?: boolean;
}

export interface DataInfo {
  organizer: OrganizerInfo;
  attendee: AttendeeInfo;
}

export type DrawSignal = 'up' | 'down' | 'move';
export type DrawPoint = [
  x: number,
  y: number,
  width: number,
  height: number,
  signal: DrawSignal
];
