/**
 * background <-> content
 * background <-> popup
 * 주고 받는 message key
 */
export const MESSAGE_KEY = {
  CONNECT: 'connect',
  REFETCH: 'refetch',
  UPDATE: 'update',
  INSTALL: 'install',
  UNINSTALL: 'uninstall',
  URL: 'url',
  ENABLED: 'enabled',
  TARGET: 'target',
  ACTIVE: 'active',
  TOGGLE: 'toggle',
} as const;
export type MESSAGE_KEY = typeof MESSAGE_KEY[keyof typeof MESSAGE_KEY];

/**
 * content <-> socket
 * 주고 받는 socket event
 */
export const SOCKET_EVENT = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  JOIN: 'join',
  REFETCH: 'organizer-info:refetch',
  UPDATE: 'organizer-info:update',
  DRAW: 'draw:add',
};
export type SOCKET_EVENT = typeof SOCKET_EVENT[keyof typeof SOCKET_EVENT];
