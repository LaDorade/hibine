import {Server} from 'socket.io';

import type { TabKind } from '$types/tabs';
import type {HttpServer} from 'vite';
import type { ClientToServerEvents, ServerClientEvents } from '$types/socket';


const tapeKey = 'tape:';

export function initServerWebsocket(server: HttpServer | null) {
  if (!server) {
    console.error('could not start websocket services');
    return;
  }

  if (globalThis.myServerSocket) {
    globalThis.myServerSocket.close();
    globalThis.myServerSocket = null;
  }

  const fileUserMap = new Map<
		string, // file path
		Set<string> // users connected
	>();

  const io = new Server<ClientToServerEvents, ServerClientEvents>(server);
  globalThis.myServerSocket = io;


  io.on('connection', async (socket) => {
    socket.on('disconnect', () => {
      for (const [_file, users] of fileUserMap) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
        }
      }
    });
    console.log(
      'a user connected',
      socket.id,
      socket.handshake.headers['x-tape-name'],
      socket.handshake.headers.cookie
    );

		
    // todo: imp
    // I would like something like that, but ws is outside of vite and svelte, without env access
    // await ensureTapeExists(tape);

    // same here, alias + env
    // if (!socket.handshake.headers.cookie) {
    //   console.warn('Missing session cookie');
    //   socket.disconnect(true);
    //   return;
    // }
    // const cookieObj = JSON.parse(socket.handshake.headers.cookie);
    // const auth = await validateSessionToken(
    //   cookieObj['auth-session']
    // );
    // if (!auth || !auth.session) {
    //   console.warn('Invalid session token');
    //   socket.disconnect(true);
    //   return;
    // }

    const tape = socket.handshake.headers['x-tape-name'];
    if (!tape || typeof tape !== 'string') {
      console.warn('Invalid or missing tape name');
      socket.disconnect(true);
      return;
    }

    await socket.join(tapeKey + tape);

    socket.on('tab-opened', (tab: {id: string, kind: TabKind}, callback) => {
      if (!socket.id || tab.kind !== 'file') return;

      console.info('[Info] Tab opened by', 
        socket.id, 
        tab,
        'on',
        [...socket.rooms].filter(r => r.startsWith('tape:')).map(r => r.slice(tapeKey.length)).join()
      );

      if (!fileUserMap.has(tab.id)) {
        fileUserMap.set(tab.id, new Set<string>());
      }
      const users = fileUserMap.get(tab.id)!;
      users.add(socket.id);

      socket.broadcast.emit('users-on-file', {
        file: tab.id,
        usersNb: fileUserMap.get(tab.id)?.size ?? 0
      });
      console.log(fileUserMap.get(tab.id)?.size, 'users on', tab.id);
      callback(fileUserMap.get(tab.id)?.size ?? 0);
    });

    socket.on('tab-closed', (tab: {id: string, kind: TabKind}) => {
      if (!socket.id || tab.kind !== 'file') return;
      console.info('[Info] Tab closed', tab);

      if (fileUserMap.has(tab.id)) {
        const users = fileUserMap.get(tab.id)!;
        users.delete(socket.id);
      }
			
      socket.broadcast.emit('users-on-file', {
        file: tab.id,
        usersNb: fileUserMap.get(tab.id)?.size ?? 0
      });
      console.log(fileUserMap.get(tab.id)?.size, 'users on', tab.id);
    });
  });
}

export function getServerSocket() {
  const io = globalThis.myServerSocket;
  if (!io) {
    throw new Error('Websocket server not initialized');
  }
  return io;
}