import { pushState } from '$app/navigation';

import { FileAPI } from './internal/FileAPI.svelte';
import { EntryAPI } from './internal/EntryAPI.svelte';
import { TabKindEnum, TabStore } from './internal/stores/TabStore.svelte';
import { FoldState } from '$core/internal/FoldState.svelte';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';
import { getCurrentTape } from '$lib/remotes/files.remote';
import { ViewMap } from '$components/Main/View';


class CoreAPI {
  readonly #tabStore: TabStore;

  readonly files: FileAPI;
  readonly entries: EntryAPI;
  readonly foldState: FoldState;
	
	
  constructor() {
    // Internal
    this.#tabStore = new TabStore(this);

    this.files = new FileAPI(this);
    this.entries = new EntryAPI(this);
    this.foldState = new FoldState();
  }

  async init() {
    const tapeName = await getCurrentTape();
    this.foldState.init(tapeName);
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

  async openFileAtPath(path: string, triggerHistory = true) {
    const file = await this.files.getFile(path);
    await this.openFile(file, triggerHistory);
  }

  async openFile(file: FileEntry, triggerHistory = true) {
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
      const oldTabId = this.activeTab?.id;

      this.#tabStore.openTab(tabEntry);

      if (triggerHistory) {
        pushState('', {
          oldTabId,
          active: this.activeTab?.id
        });
      }
    } else {
      // If already opened, just activate it
      await this.activateTab(file.path);
    }
  }
	
  async openView(name: keyof typeof ViewMap, triggerHistory = true) {
    const viewDef = ViewMap[name];
    if (!viewDef) {
      throw new Error(`View "${name}" not found in ViewMap`);
    }

    // Open view in store (UI)
    if (!this.#tabStore.tabs.find(t => t.kind === 'view' && t.id === name)) {
      const tabEntry = {
        kind: TabKindEnum.VIEW as const,
        id: name,
        component: viewDef.component,
        title: viewDef.title
      };
      const oldTabId = this.activeTab?.id;

      this.#tabStore.openTab(tabEntry);

      if (triggerHistory) {
        pushState('', {
          oldTabId,
          active: this.activeTab?.id
        });
      }
    } else {
      // If already opened, just activate it
      await this.activateTab(name);
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

  async closeTab(tabId: string, triggerHistory = true) {
    const tab = this.#tabStore.tabs.find(t => t.id === tabId);
    if (!tab) return;

    // Close the tab in the store
    await this.#tabStore.closeTab(tab.id);

    if (triggerHistory) {
      pushState('', {
        oldTabId: this.activeTab?.id,
        active: tabId
      });
    }
  }

  /**
	 * Method to sync changes between the server and the client
	 * @fires {@linkcode CoreAPI.tabs}
	 * @fires {@linkcode CoreAPI.activeTab}
	 */
  async syncStates(modifications: EntryModification[]) {
    await this.#tabStore.syncModifications(modifications);
    await this.foldState.syncModifications(modifications);
  }

  async clear() {
    this.#tabStore.clear();
    this.foldState.clear();
  }
}

export type { CoreAPI };
export const coreAPI = new CoreAPI();