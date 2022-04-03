import { Manager, ManagerOptions } from "./manager.js";
import { Socket, SocketOptions } from "./socket.js";
/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @public
 */

/**
 * Expose constructors for standalone build.
 *
 * @public
 */
export { }
declare global {
  function io(opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  function io(uri: string, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  function io(uri: string | Partial<ManagerOptions & SocketOptions>, opts?: Partial<ManagerOptions & SocketOptions>): Socket;

  function connect(opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  function connect(uri: string, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  function connect(uri: string | Partial<ManagerOptions & SocketOptions>, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
}
