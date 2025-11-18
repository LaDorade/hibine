import { FileAPI } from './internal/FileAPI.svelte';

import { EntryAPI } from './internal/EntryAPI.svelte';
import { TabKindEnum, TabStore } from './internal/stores/TabStore.svelte';
import { SelectedStore } from './internal/stores/Selected.svelte';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';


class CoreAPI {
	readonly #tabStore: TabStore;

	readonly files: FileAPI;
	readonly entries: EntryAPI;
	readonly selectedStore: SelectedStore;
	
	
	constructor() {
		// Internal
		this.#tabStore = new TabStore(this);

		this.files = new FileAPI(this);
		this.entries = new EntryAPI(this);
		this.selectedStore = new SelectedStore();
	}

	/**
	 * @reactive Needs to be call inside a $derived or $effect
	 * or read in a reactive context
	 */
	get tabs() {
		return this.#tabStore.tabs;
	}

	/**
	 * @reactive Needs to be call inside a $derived or $effect
	 * or read in a reactive context
	 */
	get activeTab() {
		return this.#tabStore.activeTab;
	}

	isActiveTab(tabId: string) {
		return this.#tabStore.activeTabId === tabId;
	}

	async openFile(file: FileEntry) {
		// Open file in store (UI)
		if (!this.#tabStore.tabs.find(t => t.kind === 'file' && t.id === file.path)) {
			// Load content
			const content = await this.files.readFile(file);
			file.content = content;

			const tabEntry = {
				kind: TabKindEnum.FILE as const,
				id: file.path,
				file: file,
				title: file.name
			};
			await this.#tabStore.openTab(tabEntry);
		} else {
			// If already opened, just activate it
			await this.activateTab(file.path);
		}
	}

	async activateTab(tabId: string) {
		const tab = this.#tabStore.tabs.find(t => t.id === tabId);
		if (!tab) return;

		// Set the active tab in the store
		this.#tabStore.activeTabId = tab.id;

		if (tab.kind === 'file') {
			const content = await this.files.readFile(tab.file);
			tab.file.content = content;
		}
	}

	async closeTab(tabId: string) {
		const tab = this.#tabStore.tabs.find(t => t.id === tabId);
		if (!tab) return;

		// Close the tab in the store
		this.#tabStore.closeTab(tab.id);
	}

	/**
	 * Method to sync changes between the server and the client
	 * @fires {@linkcode CoreAPI.tabs}
	 * @fires {@linkcode CoreAPI.activeTab}
	 */
	async syncStates(modifications: EntryModification[]) {
		await this.#tabStore.syncModifications(modifications);
	}

}

export type { CoreAPI };
export const coreAPI = new CoreAPI();