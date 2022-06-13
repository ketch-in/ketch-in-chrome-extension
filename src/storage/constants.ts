/**
 * request observer에서 동작 감지를 위한 상태
 */
export const STATE = {
  PENDING: 'pending',
  PARTICIPATING: 'participating',
  PRESENTING: 'presenting',
} as const;
export type STATE = typeof STATE[keyof typeof STATE];

export const TARGET = {
  SELF: 'self',
  OTHER: 'other',
} as const;
export type TARGET = typeof TARGET[keyof typeof TARGET];
