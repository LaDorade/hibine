import { getFileTree } from '$lib/remotes/files.remote';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FolderEntry } from '$types/files';
import type { CreatedModification } from '$types/modification';

const TIMEOUT_MS = 5000;

export class EntryAPI {
  constructor(private core: CoreAPI) {}

  createEntry = async (entryPath: string) => {
    const res = await new Promise<CreatedModification>((resolve, reject) => {
      this.core.clientSocket?.timeout(TIMEOUT_MS).emit('entry-created', entryPath, async (err, result) => {
        if (err || !result || result[0]) {
          return reject(err ?? result ? result[0] : 'creation-failed');
        }
        await getFileTree().refresh();
        // refresh for the client who performed the modification
        // since other connected client will received the "remoteModification" event
        return resolve(result[1]);
      });
    });
    return res;
  };

  /**
	 * Remove a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  removeEntry = async (entryPath: string) => {
    this.core.clientSocket?.emit('entry-deleted', entryPath);
  };
  /**
	 * Rename a file or folder entry
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  renameEntry = async (entryPath: string, newName: string) => {
    this.core.clientSocket?.emit('entry-renamed', {entryPath, newName});
  };
  /**
	 * Move a file or folder entry to a destination folder
	 * @fires {@linkcode FileAPI.getOpenFiles}
	 * @fires {@linkcode FileAPI.getActiveFile}
	 */
  moveEntry = async (entryPath: string, folderEntry: FolderEntry) => {
    this.core.clientSocket?.emit('entry-moved', {entryPath, destFolder: folderEntry.path});
  };
}