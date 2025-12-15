import type { FileEntry, FsNode } from '$types/files';

export type TapeFileStore = () => {
    tapeEntries: FsNode[];
    tapeFiles: FileEntry[];
}