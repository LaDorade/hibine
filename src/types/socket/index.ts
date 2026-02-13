import type { TabKind } from '$types/tabs';

export type ClientToServerEvents = {
	'tab-opened': (_params: {id: string, kind: TabKind}, cb: (usersNb: number) => void) => void
	'tab-closed': (_params: {id: string, kind: TabKind}) => void;
};
export type ServerClientEvents = {
	'users-on-file': (_params: {file: string, usersNb: number}) => void;
}