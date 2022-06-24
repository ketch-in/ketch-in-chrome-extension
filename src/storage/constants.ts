/**
 * request observer에서 동작 감지를 위한 상태
 */
export enum STATE {
  PENDING = 'pending',
  PARTICIPATING = 'participating',
  PRESENTING = 'presenting',
}

export enum TARGET {
  SELF = 'self',
  OTHER = 'other',
}
