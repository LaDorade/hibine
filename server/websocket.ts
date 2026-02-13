import {Server} from 'socket.io';
import type { TabKind } from '$types/tabs';
import type {HttpServer} from 'vite';

import type { ClientToServerEvents, ServerClientEvents } from '$types/socket';


const fileUserMap = new Map<
	string, // file path
	Set<string> // users connected
>();

export function initServerWebsocket(server: HttpServer | null) {

  if (!server) {
    console.error('could not start websocket services');
    return;
  }

  const io = new Server<ClientToServerEvents, ServerClientEvents, object, object>(server);

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('tab-opened', (tab: {id: string, kind: TabKind}, callback) => {
      if (!socket.id || tab.kind !== 'file') return;

      console.info('[Info] Tab opened by', socket.id, tab);

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

    socket.on('disconnect', () => {
      for (const [_file, users] of fileUserMap) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
        }
      }
    });
  });
}