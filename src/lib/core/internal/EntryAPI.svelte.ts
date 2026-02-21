
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
    this.core.clientSocket?.socket.emit('entry-deleted', entryPath);
  };
  /**
	 * Rename a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  renameEntry = async (entryPath: string, newName: string) => {
    this.core.clientSocket?.socket.emit('entry-renamed', {entryPath, newName});
  };
  /**
	 * Move a file or folder entry to a destination folder
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  moveEntry = async (entryPath: string, folderEntry: FolderEntry) => {
    this.core.clientSocket?.socket.emit('entry-moved', {entryPath, destFolder: folderEntry.path});
  };
}