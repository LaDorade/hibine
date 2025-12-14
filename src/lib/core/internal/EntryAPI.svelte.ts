import { moveEntry, removeEntry, renameEntry } from '$lib/remotes/files.remote';

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
    const modifications = await removeEntry({ entryPath: entryPath });
    await this.core.syncStates(modifications);
  };
  /**
	 * Rename a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  renameEntry = async (entryPath: string, newName: string) => {
    const modifications = await renameEntry({ entryPath: entryPath, newName: newName });
    await this.core.syncStates(modifications);
  };
  /**
	 * Move a file or folder entry to a destination folder
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  moveEntry = async (entryPath: string, folderEntry: FolderEntry) => {
    const modifications = await moveEntry({ entryPath: entryPath, destFolder: folderEntry.path });
    await this.core.syncStates(modifications);
  };
}