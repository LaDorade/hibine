import path, { dirname } from 'node:path';
import { move, remove } from 'fs-extra/esm';
import { getRelativePathFromTape, getValidPathFromTape, sanitizeFileName } from '$lib/remotes/files.utils';
import { writeFile, mkdir, lstat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import type { CreatedModification, DeleteModification, MovedModification, RenamedModification } from '$types/modification';
import type { Result } from '$types/utils';
import type { CreateEntryError } from '$types/entries';


export async function deleteEntry(tape: string, entryPath: string)
: Promise<DeleteModification> {
  const saneEntryPath = getValidPathFromTape(tape, entryPath);
  const stats = await lstat(saneEntryPath);
  const isFolder = stats.isDirectory();
	
  await remove(saneEntryPath);

  return {
    type: 'removed',
    oldPath: path.join(getRelativePathFromTape(tape, saneEntryPath), isFolder ? '/' : ''),
    isFolder
  };
}

export async function renameEntry(tape: string, entryPath: string, newName: string)
: Promise<RenamedModification | null> {
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

export async function moveEntry(tape: string, entryPath: string, targetFolderPath: string)
: Promise<MovedModification | null> {
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

export async function createEntry(tape: string, entryPath: string):
	Promise<Result<CreatedModification, CreateEntryError>>
{
  if (!entryPath.trim() || /[<>:"|?*]/.test(entryPath)) {
    return ['invalid-name', null];
  }

  const saneFilePath = getValidPathFromTape(tape, entryPath);
  const fName = entryPath.split('/').pop();
  if (!fName) {
    return ['invalid-name', null];
  }

  if (existsSync(saneFilePath)) {
    return ['already-exists', null];
  }

  if (saneFilePath.endsWith('/')) {
    await mkdir(saneFilePath, { recursive: true });
    console.info(`Created directory at ${saneFilePath}`);
    return [null, {
      type: 'created',
      newPath: path.join(getRelativePathFromTape(tape, saneFilePath), '/'),
      isFolder: true
    }];
  }

  try {
    // Créer le dossier s'il n'existe pas
    await mkdir(dirname(saneFilePath), { recursive: true });
    // Créer le fichier
    await writeFile(saneFilePath, '', 'utf-8');
    console.info(`Created file at ${saneFilePath}`);
  } catch (err) {
    console.error('Error creating file:', err);
    return ['creation-failed', null];
  }

  return [null,
    {
      type: 'created',
      newPath: getRelativePathFromTape(tape, saneFilePath),
      isFolder: false
    }
  ];
}
