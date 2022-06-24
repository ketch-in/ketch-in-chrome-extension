/**
 * background <-> content
 * background <-> popup
 * 주고 받는 message key
 */
export enum MESSAGE_KEY {
  CONNECT = 'connect',
  REFETCH = 'refetch',
  UPDATE = 'update',
  INSTALL = 'install',
  UNINSTALL = 'uninstall',
  URL = 'url',
  ENABLED = 'enabled',
  TARGET = 'target',
  ACTIVE = 'active',
  TOGGLE = 'toggle',
}

/**
 * content <-> socket
 * 주고 받는 socket event
 */
export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  JOIN = 'join',
  REFETCH = 'organizer-info:refetch',
  UPDATE = 'organizer-info:update',
  DRAW = 'draw:add',
}
