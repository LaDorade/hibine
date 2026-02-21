import path from 'node:path';
import { z } from 'zod';
import { move, remove } from 'fs-extra/esm';
import { lstat } from 'fs/promises';
import { getRelativePathFromTape, getValidPathFromTape, sanitizeFileName } from '$lib/remotes/files.utils';
import type { EntryModification } from '$types/modification';
import type { TabKind } from '$types/tabs';

export const tapePrefix = 'tape:';

export function getServerSocket() {
  if (!globalThis.myServerSocket) {
    throw new Error('Websocket server not initialized');
  }
  return globalThis.myServerSocket;
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
    console.log(
      socket.id,
      'connected to',
      socket.handshake.headers['x-tape-name'],
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

    await socket.join(tapePrefix + tape);

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
      const saneEntryPath = getValidPathFromTape(tape, parsed.data);
      const stats = await lstat(saneEntryPath);
      const isFolder = stats.isDirectory();

      await remove(saneEntryPath);
			
      const modifications = [{
        type: 'removed',
        oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
        newPath: '',
        isFolder
      }] satisfies EntryModification[];

      io.to(tapePrefix + tape)
        .emit('remoteModification', modifications);
    });
    socket.on('entry-renamed', async (params: EntryRenamedParams) => {
      const parsed = await entryRenamedSchema.safeParseAsync(params);
      if (!parsed.success) {
        console.warn('Invalid entry renamed params:', parsed.error);
        return;
      }
      const saneEntryPath = getValidPathFromTape(tape, parsed.data.entryPath);
      const sanitizedName = sanitizeFileName(parsed.data.newName);
      const targetFolder = path.dirname(saneEntryPath);
      console.log(targetFolder);
			
      const newPath = path.resolve(targetFolder, sanitizedName);

      if (saneEntryPath === newPath) {
        return;
      }

      await move(saneEntryPath, newPath);

      const isFolder = await lstat(newPath).then(stats => stats.isDirectory()).catch(() => false);
      const modifications = [{
        type: 'renamed',
        oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
        newPath: path.join(getRelativePathFromTape(tape, newPath), isFolder ? '/' : ''),
        isFolder
      }] satisfies EntryModification[];

      io.to(tapePrefix + tape)
        .emit('remoteModification', modifications);
    });
    socket.on('entry-moved', async (params: EntryMovedParams) => {
			  // Validation
      const parsed = await entryMovedSchema.safeParseAsync(params);
      if (!parsed.success) {
        console.warn('Invalid entry moved params:', parsed.error);
        return;
      }
      const saneEntryPath = getValidPathFromTape(tape, parsed.data.entryPath);
      const saneDestFolder = getValidPathFromTape(tape, parsed.data.destFolder);

      const entryName = path.basename(saneEntryPath);
      const newEntryPath = path.resolve(saneDestFolder, entryName);

      if (saneEntryPath === newEntryPath) {
        return;
      }

      // Operation
      await move(saneEntryPath, newEntryPath);

      // Emit modification
      const isFolder = await lstat(newEntryPath).then(stats => stats.isDirectory()).catch(() => false);
      const modifications = [{
        type: 'moved',
        oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
        newPath: path.join(getRelativePathFromTape(tape, newEntryPath), isFolder ? '/' : ''),
        isFolder
      }] satisfies EntryModification[];
      io.to(tapePrefix + tape)
        .emit('remoteModification', modifications);
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