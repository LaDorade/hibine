type Entry = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    childs: FileTree[] | null;
}

export type FileTree = FileEntry | FolderEntry;

export type FileEntry = Entry & {
    type: 'file';
    childs: null;
    content: string | null;
}

export type FolderEntry = Entry & {
    type: 'dir';
    childs: FileTree[];
}

export type FileWithContent = FileEntry & {
    content: string | null;
}