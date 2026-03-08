type ModificationKind = 'created' | 'moved' | 'renamed' | 'removed';

interface Modification {
	type: ModificationKind;
	isFolder: boolean;
}

export interface CreatedModification extends Modification {
	type: 'created';
	newPath: string;
}

export interface DeleteModification extends Modification {
	type: 'removed';
	oldPath: string;
}

export interface MovedModification extends Modification {
	type: 'moved';
	oldPath: string;
	newPath: string;
}

export interface RenamedModification extends Modification {
	type: 'renamed';
	oldPath: string;
	newPath: string;
}

export type EntryModification =
	| CreatedModification
	| DeleteModification
	| MovedModification
	| RenamedModification;