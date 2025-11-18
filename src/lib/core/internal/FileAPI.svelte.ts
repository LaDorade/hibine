import { createFileCmd, createFileIfNotExists, getFileContent, writeFileContent } from '$lib/remotes/files.remote';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FileEntry } from '$types/files';

/**
 * @class FileAPI
 * @internal You should not use this API directly, but use {@linkcode CoreAPI.files} instead.
 */
export class FileAPI {
	constructor(private core: CoreAPI) {}

	/**
	 * Read file content from disk.
	 * No update of the FileEntry content in the store.
	 */
	readFile = async (file: { path: string }): Promise<string> => {
		return await getFileContent(file.path);
	};
	/**
	 * One-way writing file content to disk.
	 * No update of the FileEntry content in the store.
	 * If needed, the caller should update it with {@linkcode FileAPI.readFile}
	 * or {@linkcode FileAPI.openFile}.
	 */
	writeFile = async (file: FileEntry, content: string): Promise<void> => {
		await writeFileContent({ filePath: file.path, content });
	};


	async createFile(filePath: string): Promise<FileEntry> {
		return await createFileCmd({filePath});
	}

	/**
	 * Creates a file if it does not exist and opens it in a new tab.
	 * @fires {@linkcode CoreAPI.tabs} – a new tab is created for the file
	 * @fires {@linkcode CoreAPI.activeTab} – switch to the newly created file's tab
	 */
	async createAndOpenFile(filePath: string): Promise<FileEntry> {
		const file = await createFileIfNotExists({filePath});
		await this.core.openFile(file);
		return file;
	}
}