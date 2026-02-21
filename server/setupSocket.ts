import {Server} from 'socket.io';

import type {HttpServer} from 'vite';
import type { ClientToServerEvents, ServerClientEvents } from '$types/socket';

/**
 * Init the global websocket server object
 * Intended to be called once, in vite plugin or express middleware, before sveltekit server hook import
 */
export function initServerWebsocket(server: HttpServer | null) {
  if (!server) {
    console.error('could not start websocket services');
    return;
  }

  if (globalThis.myServerSocket) {
    globalThis.myServerSocket.close();
    globalThis.myServerSocket = null;
  }
  const io = new Server<ClientToServerEvents, ServerClientEvents>(server);
  globalThis.myServerSocket = io;
}

export function getServerSocket() {
  const io = globalThis.myServerSocket;
  if (!io) {
    throw new Error('Websocket server not initialized');
  }
  return io;
}