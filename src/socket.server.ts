import { z } from 'zod';
import { validateSessionToken } from '$lib/server/auth';
import { tapeExists } from '$lib/server/tape.utils';
import { deleteEntry, moveEntry, renameEntry } from '$lib/server/entries';

import type { TabKind } from '$types/tabs';
import type { Socket } from 'socket.io';

export const tapePrefix = 'tape:';

export function getServerSocket() {
  if (!globalThis.myServerSocket) {
    throw new Error('Websocket server not initialized');
  }
  return globalThis.myServerSocket;
}

async function validateAndAttachUserInfos(socket: Socket) {
  // Check tape
  const tape = socket.handshake.headers['x-tape-name'];
  if (!tape || typeof tape !== 'string') {
    console.warn('Invalid or missing tape name');
    socket.disconnect(true);
    return;
  }
  const tapeExistsResult = await tapeExists(tape);
  if (!tapeExistsResult) {
    console.warn('Tape does not exist:', tape);
    socket.disconnect(true);
    return;
  }
  console.info('Client connected to tape:', tape);
  socket.data.tape = tape;

  // Check auth
  if (!socket.handshake.headers.cookie) {
    console.warn('Missing session cookie');
    socket.disconnect(true);
    return;
  }
  const cookieObj = JSON.parse(JSON.stringify(socket.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>)));
  const auth = await validateSessionToken(
    cookieObj['auth-session']
  );
  if (!auth || !auth.session) {
    console.warn('Invalid session token');
    socket.disconnect(true);
    return;
  }
  console.info('Session token valid, user authenticated for tape:', tape);
  socket.data.auth = auth;
}


export function registerSvelteKitWebsocket() {
  const io = globalThis.myServerSocket;
  if (!io) {
    console.error('Websocket server not initialized');
    return;
  }

  const fileUserMap = new Map<
			string, // file path
			Set<string> // users connected
	>();

  io.disconnectSockets();
  io.removeAllListeners();

  io.on('connection', async (socket) => {
    socket.on('disconnect', () => {
      for (const [file, users] of fileUserMap) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          socket.broadcast.emit('users-on-file', {
            file,
            usersNb: fileUserMap.get(file)?.size ?? 0
          });
        }
      }
    });

    await validateAndAttachUserInfos(socket);

    // Join tape room
    await socket.join(tapePrefix + socket.data.tape);
    console.info(socket.data.auth.user?.username, 'joined tape', socket.data.tape, 'with socket id', socket.id);

    /* * Tab operations handlers * */
    socket.on('tab-opened', (tab: {id: string, kind: TabKind}, callback) => {
      if (!socket.id || tab.kind !== 'file') return;

      console.info('[Info] Tab opened by', 
        socket.id, 
        tab,
        'on',
        [...socket.rooms].filter(r => r.startsWith('tape:')).map(r => r.slice(tapePrefix.length)).join()
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

    /* * Entry operations handlers * */
    socket.on('entry-deleted', async (entryDeletion: EntryDeletedParams) => {
      const parsed = await entryDeletedSchema.safeParseAsync(entryDeletion);
      if (!parsed.success) {
        console.warn('Invalid entry deletion params:', parsed.error);
        return;
      }

      const modif = await deleteEntry(socket.data.tape, parsed.data);

      io.to(tapePrefix + socket.data.tape)
        .emit('remoteModification', [modif]);
    });
    socket.on('entry-renamed', async (params: EntryRenamedParams) => {
      const parsed = await entryRenamedSchema.safeParseAsync(params);
      if (!parsed.success) {
        console.warn('Invalid entry renamed params:', parsed.error);
        return;
      }

      const modif = await renameEntry(socket.data.tape, parsed.data.entryPath, parsed.data.newName);
      if (!modif) {
        return;
      }

      io.to(tapePrefix + socket.data.tape)
        .emit('remoteModification', [modif]);
    });
    socket.on('entry-moved', async (params: EntryMovedParams) => {
      // Validation
      const parsed = await entryMovedSchema.safeParseAsync(params);
      if (!parsed.success) {
        console.warn('Invalid entry moved params:', parsed.error);
        return;
      }

      const {entryPath, destFolder} = parsed.data;
      const modif = await moveEntry(socket.data.tape, entryPath, destFolder);
      if (!modif) {
        return;
      }
			
      io.to(tapePrefix + socket.data.tape)
        .emit('remoteModification', [modif]);
    });
  });
}

const entryDeletedSchema = z.string();
const entryRenamedSchema = z.object({
  entryPath: z.string(),
  newName: z.string()});
const entryMovedSchema = z.object({
  entryPath: z.string(),
  destFolder: z.string()
});

type EntryDeletedParams = z.infer<typeof entryDeletedSchema>;
type EntryRenamedParams = z.infer<typeof entryRenamedSchema>;
type EntryMovedParams = z.infer<typeof entryMovedSchema>;