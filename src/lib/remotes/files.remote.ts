import z from 'zod';
import path, { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { writeFile, mkdir, readFile, rm, lstat } from 'node:fs/promises';
import { move } from 'fs-extra/esm';
import { error } from '@sveltejs/kit';
import { command, form, getRequestEvent, query } from '$app/server';
import { createFileTree } from '$lib';
import { env } from '$env/dynamic/private';
import { getRelativePathFromTape, getValidPathInTape, sanitizeFileName } from './files.utils';
import type { FileEntry, FsNode } from '$types/files';
import type { EntryModification } from '$types/modification';

const NOTE_DIR = env.NOTE_DIR;

export const getFileTree = query(async (): Promise<FsNode[]> => {
  const { params } = getRequestEvent();
  const tape = params.tape;
  if (!tape) {
    throw error(400, 'Tape parameter is missing');
  }

  try {
    // todo: validate tape to prevent directory traversal attacks
    const tree = await createFileTree(join(NOTE_DIR, tape));
    return tree;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw error(404, 'Tape not found');
    }
    throw error(500, 'Failed to get file tree');
  }
});

export const getCurrentTape = query(async (): Promise<string> => {
  const { params } = getRequestEvent();
  const tape = params.tape;
  if (!tape) {
    throw error(400, 'Tape parameter is missing');
  }
  return tape;
});


export const getFileContent = query(z.string(), async (filePath): Promise<{
		content: string;
		timestamp: number;
}> => {
  const path = getValidPathInTape(filePath);
  const file = await readFile(path, {
    encoding: 'utf-8',
  });
  const stats = await lstat(path);
  return {
    content: file,
    timestamp: stats.mtimeMs
  };
});

export const resolveFile = query(z.string(), async (filePath): Promise<FileEntry> => {
  const saneFilePath = getValidPathInTape(filePath);
  if (!existsSync(saneFilePath)) {
    throw error(404, 'File not found');
  }

  const stats = await lstat(saneFilePath);
  if (stats.isDirectory()) {
    throw error(400, 'Path is a directory, not a file');
  }

  const content = await readFile(saneFilePath, { encoding: 'utf-8' });
  return {
    name: path.basename(saneFilePath),
    path: getRelativePathFromTape(saneFilePath),
    type: 'file',
    content,
    childs: null,
    lastKnownTimestamp: Date.now()
  };
});

export const createFile = form(z.object({
  fileName: z.string()
}), async ( {fileName}, invalid): Promise<FsNode> => {
  if (!fileName.trim() || /[<>:"|?*]/.test(fileName)) {
    return invalid(invalid.fileName(`Invalid file name: ${fileName}`));
  }

  const saneFilePath = getValidPathInTape(fileName);
  const newFilename = sanitizeFileName(fileName.split('/').pop() || 'untitled');

  const {params} = getRequestEvent();
  if (!params.tape) {
    throw error(400, 'Tape parameter is missing');
  }

  if (saneFilePath.endsWith('/')) {
    await mkdir(saneFilePath, { recursive: true });
    await getFileTree().refresh();
    console.info(`Created directory at ${saneFilePath}`);
    return {
      name: newFilename,
      path: getRelativePathFromTape(saneFilePath),
      type: 'dir',
      childs: []
    };
  }

  if (existsSync(saneFilePath)) {
    return invalid(invalid.fileName('File already exists'));
  }
  try {
    // Créer le dossier s'il n'existe pas
    await mkdir(dirname(saneFilePath), { recursive: true });
    // Créer le fichier
    await writeFile(saneFilePath, '', 'utf-8');
    console.info(`Created file at ${saneFilePath}`);
  } catch (err) {
    console.error('Error creating file:', err);
    return invalid(invalid.fileName('Error creating file'));
  }

  await getFileTree().refresh();

  return {
    name: newFilename,
    path: getRelativePathFromTape(saneFilePath),
    type: 'file',
    content: '',
    childs: null,
    lastKnownTimestamp: Date.now()
  };
});

export const createFileCmd = command(z.object({
  filePath: z.string()
}), async ({ filePath: fileName }): Promise<FileEntry> => {
  // 1. Sanitize and validate file name
  const filePath = getValidPathInTape(fileName);

  // 2. Check if file already exists
  if (existsSync(filePath)) {
    throw new Error('File already exists');
  }

  // 3. Create necessary directories (supports nested paths like "folder/subfolder/file.txt")
  await mkdir(dirname(filePath), { recursive: true });

  // TODO: change "writeFile" for a safer stream-based method
  // If two request arrive at the same time, data can be lost
  // 4. Create the file
  await writeFile(filePath, '', 'utf-8');
  console.log(`Creating file at ${filePath}`);

  // 5. Refresh the file tree
  await getFileTree().refresh();

  return {
    name: path.basename(filePath),
    path: getRelativePathFromTape(filePath),
    type: 'file',
    content: '',
    childs: null,
    lastKnownTimestamp: Date.now()
  };
});

export const createFileIfNotExists = command(z.object({
  filePath: z.string()
}), async ({ filePath: fileName }): Promise<FileEntry> => {
  const filePath = getValidPathInTape(fileName);

  if (!existsSync(filePath)) {
    // Create necessary directories
    await mkdir(dirname(filePath), { recursive: true });
	
    // Create the file
    await writeFile(filePath, '', 'utf-8');
    console.log(`Creating file at ${filePath}`);
	
    // Refresh the file tree
    await getFileTree().refresh();
  }

  return {
    name: path.basename(filePath),
    path: getRelativePathFromTape(filePath),
    type: 'file',
    content: '',
    childs: null,
    lastKnownTimestamp: Date.now()
  };
});

export const createFolder = command(z.object({
  folderName: z.string()
}), async ({ folderName }): Promise<void> => {
  const folderPath = getValidPathInTape(folderName);
  await mkdir(folderPath, { recursive: true });
  console.log(`Creating folder at ${folderPath}`);
});

export const writeFileContent = command(z.object({
  filePath: z.string(),
  content: z.string(),
  lastknownTimestamp: z.number()
}), async ({ filePath, content, lastknownTimestamp: timestamp }): Promise<number> => {
  const path = getValidPathInTape(filePath);

  const stats = await lstat(path);
  if (!stats.isFile()) {
    // Unsupported Media Type
    throw error(415, 'Path is not a file');
  }
  if (stats.mtimeMs > timestamp) {
    console.warn('LastKnown TS:', timestamp, 'file TS:', stats.mtimeMs);
    // Conflict
    throw error(409, 'File has been modified since last read');
  }
  await writeFile(path, content.trim(), 'utf-8');
  const newTimestamp = await lstat(path).then(stats => stats.mtimeMs);
  console.log(`Writing content to ${path},
length: ${content.length},
TS: ${newTimestamp}`);

  return newTimestamp;
});

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