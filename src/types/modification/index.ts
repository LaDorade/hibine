export type EntryModification = {
		type: 'moved' | 'renamed' | 'removed';
		oldPath: string;
		newPath: string;
		isFolder: boolean;
};