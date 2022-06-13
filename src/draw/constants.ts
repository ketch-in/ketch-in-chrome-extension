export const DRAW_SIGNAL = {
  DOWN: 'down',
  MOVE: 'move',
  UP: 'up',
} as const;
export type DRAW_SIGNAL = typeof DRAW_SIGNAL[keyof typeof DRAW_SIGNAL];

export const COVER_ELEMENT_ID = 'attendee_cover';
