import { moveEntry, removeEntry, renameEntry } from '$lib/remotes/entries.remote';

import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FolderEntry } from '$types/files';

export class EntryAPI {
  constructor(private core: CoreAPI) {}

  /**
	 * Remove a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  removeEntry = async (entryPath: string) => {
    await removeEntry({ entryPath: entryPath });
  };
  /**
	 * Rename a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  renameEntry = async (entryPath: string, newName: string) => {
    await renameEntry({ entryPath: entryPath, newName: newName });
  };
  /**
	 * Move a file or folder entry to a destination folder
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  moveEntry = async (entryPath: string, folderEntry: FolderEntry) => {
    await moveEntry({ entryPath: entryPath, destFolder: folderEntry.path });
  };
}