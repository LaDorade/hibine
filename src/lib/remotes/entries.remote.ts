import z from 'zod';
import path from 'node:path';
import { rm, lstat } from 'node:fs/promises';
import { move } from 'fs-extra/esm';
import { command } from '$app/server';

import { getRelativePathFromTape, getValidPathInTape, sanitizeFileName } from './files.utils';
import { getFileTree } from './files.remote';
import type { EntryModification } from '$types/modification';



export const moveEntry = command(z.object({
  entryPath: z.string(),
  destFolder: z.string()
}), async ({ entryPath, destFolder }): Promise<EntryModification[]> => {
  const saneEntryPath = getValidPathInTape(entryPath);
  const saneDestFolder = getValidPathInTape(destFolder);

  const entryName = path.basename(saneEntryPath);
  const newEntryPath = path.resolve(saneDestFolder, entryName);

  if (saneEntryPath === newEntryPath) {
    return [];
  }

  await move(saneEntryPath, newEntryPath);

  const isFolder = await lstat(newEntryPath).then(stats => stats.isDirectory()).catch(() => false);
  const modifications = [{
    type: 'moved',
    oldPath: path.join(getRelativePathFromTape(saneEntryPath), isFolder ? '/' : ''),
    newPath: path.join(getRelativePathFromTape(saneDestFolder), entryName, isFolder ? '/' : ''),
    isFolder
  }] satisfies EntryModification[];
  console.log(modifications);

  await getFileTree().refresh();
  return modifications;
});

export const renameEntry = command(z.object({
  entryPath: z.string(),
  newName: z.string()
}), async ({ entryPath, newName }): Promise<EntryModification[]> => {
  const saneEntryPath = getValidPathInTape(entryPath);
  const sanitizedName = sanitizeFileName(newName);
  const targetFolder = path.dirname(saneEntryPath);
  const newPath = path.resolve(targetFolder, sanitizedName);

  if (saneEntryPath === newPath) {
    return [];
  }

  await move(saneEntryPath, newPath);

  const isFolder = await lstat(newPath).then(stats => stats.isDirectory()).catch(() => false);
  const modifications = [{
    type: 'renamed',
    oldPath: path.join(getRelativePathFromTape(saneEntryPath), isFolder ? '/' : ''),
    newPath: path.join(getRelativePathFromTape(newPath), isFolder ? '/' : ''),
    isFolder
  }] satisfies EntryModification[];
  console.log(modifications);
	
  await getFileTree().refresh();
  return modifications;
});

export const removeEntry = command(z.object({
  entryPath: z.string()
}), async ({ entryPath }): Promise<EntryModification[]> => {
  const saneEntryPath = getValidPathInTape(entryPath);
  const stats = await lstat(saneEntryPath);
  const isFolder = stats.isDirectory();

  await rm(saneEntryPath, { recursive: true, force: true });

  const modifications = [{
    type: 'removed',
    oldPath: path.join(getRelativePathFromTape(saneEntryPath), isFolder ? '/' : ''),
    newPath: '',
    isFolder
  }] satisfies EntryModification[];
  console.log(modifications);

  await getFileTree().refresh();
  return modifications;
});