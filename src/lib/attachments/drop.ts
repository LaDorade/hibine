import { dragStore } from '$stores/Drag.svelte';
import { coreAPI } from '$core/CoreAPI.svelte';
import type { FileTree, FolderEntry } from '$types/files';

export async function dropAndMove(folder: FolderEntry): Promise<boolean> {
  const data = dragStore.drop() as FileTree;
  if (!data.path) {
    return false;
  }
  await coreAPI.entries.moveEntry(data.path, folder);
  return true;
}