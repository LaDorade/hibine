import path from 'node:path';
import { lstat } from 'fs/promises';
import { move, remove } from 'fs-extra/esm';
import { getRelativePathFromTape, getValidPathFromTape, sanitizeFileName } from '$lib/remotes/files.utils';
import type { EntryModification } from '$types/modification';

export async function deleteEntry(tape: string, entryPath: string): Promise<EntryModification> {
  const saneEntryPath = getValidPathFromTape(tape, entryPath);
  const stats = await lstat(saneEntryPath);
  const isFolder = stats.isDirectory();
	
  await remove(saneEntryPath);

  return {
    type: 'removed',
    oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
    newPath: '',
    isFolder
  };
}

export async function renameEntry(tape: string, entryPath: string, newName: string): Promise<EntryModification | null> {
  const saneEntryPath = getValidPathFromTape(tape, entryPath);
  const sanitizedName = sanitizeFileName(newName);
  const targetFolder = path.dirname(saneEntryPath);
  console.log(targetFolder);
				
  const newPath = path.resolve(targetFolder, sanitizedName);
	
  if (saneEntryPath === newPath) {
    return null;
  }
	
  await move(saneEntryPath, newPath);
	
  const isFolder = await lstat(newPath).then(stats => stats.isDirectory()).catch(() => false);
  return {
    type: 'renamed',
    oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
    newPath: path.join(getRelativePathFromTape(tape, newPath), isFolder ? '/' : ''),
    isFolder
  };
}

export async function moveEntry(tape: string, entryPath: string, targetFolderPath: string): Promise<EntryModification | null> {
	      const saneEntryPath = getValidPathFromTape(tape, entryPath);
  const saneDestFolder = getValidPathFromTape(tape, targetFolderPath);

  const entryName = path.basename(saneEntryPath);
  const newEntryPath = path.resolve(saneDestFolder, entryName);

  if (saneEntryPath === newEntryPath) {
    return null;
  }

  // Operation
  await move(saneEntryPath, newEntryPath);

  // Emit modification
  const isFolder = await lstat(newEntryPath).then(stats => stats.isDirectory()).catch(() => false);
  return {
    type: 'moved',
    oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
    newPath: path.join(getRelativePathFromTape(tape, newEntryPath), isFolder ? '/' : ''),
    isFolder
  };
}