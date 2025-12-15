type Entry = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    childs: FsNode[] | null;
}

export type FsNode = FileEntry | FolderEntry;

export type FileEntry = Entry & {
    type: 'file';
    childs: null;
    content: string | null;
}

export type FolderEntry = Entry & {
    type: 'dir';
    childs: FsNode[];
}

export type FileWithContent = FileEntry & {
    content: string | null;
}