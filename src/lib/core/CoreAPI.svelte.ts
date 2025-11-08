import { FileAPI } from './internal/FileAPI.svelte';

import { EntryAPI } from './internal/EntryAPI.svelte';
import { PluginRegistry } from '$core/PluginRegistry.svelte';
import { HookManager } from '$core/HookManager';
import { TabStore } from './internal/stores/TabStore.svelte';
import { UIAPI } from './internal/UIAPI.svelte';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';


class CoreAPI {
	readonly #hookManager: HookManager;
	readonly #tabStore: TabStore;

	readonly ui: UIAPI;
	readonly pluginRegistry: PluginRegistry;
	readonly files: FileAPI;
	readonly entries: EntryAPI;

	constructor() {
		// Internal
		this.#hookManager = new HookManager();
		this.#tabStore = new TabStore(this);

		this.ui = new UIAPI(this);
		this.pluginRegistry = new PluginRegistry(this, this.#hookManager);
		this.files = new FileAPI(this, this.#hookManager);
		this.entries = new EntryAPI(this);
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
				kind: 'file' as const,
				id: file.path,
				file: file,
				title: file.name
			};
			await this.#tabStore.openTab(tabEntry);
		} else {
			// If already opened, just activate it
			await this.activateTab(file.path);
		}

		// 3. Trigger hooks
		await this.#hookManager.trigger('onFileOpen', file);
	}

	async openPluginView(pluginId: string, tabTitle?: string) {
		// Open plugin view in store (UI)
		if (!this.#tabStore.tabs.find(t => t.kind === 'plugin' && t.id === pluginId)) {
			const component = this.ui.viewItems.get(pluginId);
			if (!component) {
				throw new Error(`Plugin view component not found for plugin ID: ${pluginId}`);
			}
			
			const tabEntry = {
				kind: 'plugin' as const,
				id: pluginId,
				title: tabTitle || pluginId,
				component: component
			};
			await this.#tabStore.openTab(tabEntry);
		} else {
			// If already opened, just activate it
			await this.activateTab(pluginId);
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
			// Trigger hooks
			await this.#hookManager.trigger('onFileActive', tab.file);
		}
	}

	async closeTab(tabId: string) {
		const tab = this.#tabStore.tabs.find(t => t.id === tabId);
		if (!tab) return;

		// Close the tab in the store
		this.#tabStore.closeTab(tab.id);

		// Trigger hooks
		await this.#hookManager.trigger('onTabClose', tab);
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