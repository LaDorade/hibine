import type { FsNode } from '$types/files';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export async function createFileTree(parentPath: string): Promise<FsNode[]> {
  const entries = await readdir(parentPath, { withFileTypes: true });
  const childs: FsNode[] = [];

  await Promise.all(entries.map(async (e) => {
    const entryPath = getRelativeFilePath(path.join(parentPath, e.name));
    if (e.isFile()) {
      childs.push({
        name: e.name,
        path: entryPath,
        type: 'file',
        childs: null,
        content: null
      });
    } else if (e.isDirectory()) {
      const dirpath = path.join(parentPath, e.name);
      childs.push({
        name: e.name,
        path: entryPath + '/',
        type: 'dir',
        childs: await createFileTree(dirpath)
      });
    }
  }));
  return childs;
}


/**
 * This will remove the DATA_DIR and tape name from the full path
 */
function getRelativeFilePath(fullPath: string): string {
  const parts = fullPath.split('/');
  return parts.slice(2).join('/');
}