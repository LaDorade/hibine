import type { FileEntry, FileTree } from '$types/files';

export type TapeFileStore = () => {
    tapeEntries: FileTree[];
    tapeFiles: FileEntry[];
}