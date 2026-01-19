export type EntryModification = {
		type: 'created' | 'moved' | 'renamed' | 'removed';
		oldPath: string;
		newPath: string;
		isFolder: boolean;
};