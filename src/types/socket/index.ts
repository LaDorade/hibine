import type { EntryModification } from '$types/modification';
import type { TabKind } from '$types/tabs';

export type ClientToServerEvents = {
	'tab-opened': (
		_params: {id: string, kind: TabKind},
		cb: (usersNb: number) => void
	) => void
	'tab-closed': (_params: {id: string, kind: TabKind}) => void;

	'entry-deleted': (_params: string) => void;
	'entry-renamed': (_params: {entryPath: string, newName: string}) => void;
	'entry-moved': (_params: {entryPath: string, destFolder: string}) => void;
};
export type ServerClientEvents = {
	'users-on-file': (_params: {file: string, usersNb: number}) => void;
	'remoteModification': (_params: EntryModification[]) => void;
}