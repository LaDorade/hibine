import type { EntryModification } from '$types/modification';
import { SvelteMap } from 'svelte/reactivity';

export class FoldState {
	private foldStates: SvelteMap<string, boolean> = new SvelteMap<string, boolean>();

	init() {
		const folderState = JSON.parse(window.localStorage.getItem('folderState') || '{}');
		for (const [key, value] of Object.entries(folderState)) {
			this.foldStates.set(key, Boolean(value));
		}
	}

	isFolded(path: string): boolean {
		return this.foldStates.get(path) ?? false;
	}

	toggleFold(path: string): void {
		const currentState = this.foldStates.get(path) ?? false;
		this.setFoldState(path, !currentState);
	}

	setFoldState(path: string, state: boolean): void {
		this.foldStates.set(path, state);
		const folderState = JSON.parse(window.localStorage.getItem('folderState') || '{}');
		folderState[path] = state;
		window.localStorage.setItem('folderState', JSON.stringify(folderState));
	}

	clear(): void {
		this.foldStates.clear();
	}

	async syncModifications(modifications: EntryModification[]): Promise<void> {
		for (const mod of modifications) {
			if ((mod.type === 'renamed' || mod.type === 'moved') && this.foldStates.has(mod.oldPath)) {
				const state = this.foldStates.get(mod.oldPath)!;
				this.foldStates.delete(mod.oldPath);
				this.foldStates.set(mod.newPath, state);
			} else if (mod.type === 'removed' && this.foldStates.has(mod.oldPath)) {
				this.foldStates.delete(mod.oldPath);
			}
		}
	}
}
