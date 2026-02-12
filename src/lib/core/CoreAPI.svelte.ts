import { FileAPI } from './internal/FileAPI.svelte';
import { EntryAPI } from './internal/EntryAPI.svelte';
import { TabStore } from './internal/stores/TabStore.svelte';
import { FoldState } from '$core/internal/FoldState.svelte';
import { getCurrentTape } from '$lib/remotes/files.remote';
import { ViewMap } from '$components/Main/View';
import { Page } from './Page.svelte';
import { InfoUi } from './InfosUi.svelte';
import { ClientSocket, getSocket } from '$lib/websocket';
import type { FileEntry } from '$types/files';
import type { EntryModification } from '$types/modification';
import type { TabFileEntry } from '$types/tabs';


class CoreAPI {
  readonly #tabStore: TabStore;

  readonly files: FileAPI;
  readonly entries: EntryAPI;
  readonly foldState: FoldState;
  readonly pageStore: Page;
	
  readonly infoUi: InfoUi;

  readonly clientSocket: ClientSocket | null;
	
  constructor() {
    // Internal
    this.#tabStore = new TabStore(this);

    this.files = new FileAPI(this);
    this.entries = new EntryAPI(this);
    this.foldState = new FoldState();
    this.pageStore = new Page(this);

    this.infoUi = new InfoUi(this);

    this.clientSocket = getSocket(this);
  }

  async init() {
    const tapeName = await getCurrentTape();
    this.foldState.init(tapeName);
    this.pageStore.init();
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

  get activeTabUsers() {
    return this.#tabStore.activeTabUsers ?? 0;
  }
  set activeTabUsers(newNb: number) {
    this.#tabStore.activeTabUsers = newNb;
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
      file.content = content.content;
      file.lastKnownTimestamp = content.timestamp;

      const tabEntry = {
        kind: 'file' as const,
        id: file.path,
        file: file,
        title: file.name
      };
      this.#tabStore.openTab(tabEntry);
      if (triggerHistory) {
        this.pageStore.pushPage(file.path);
      }
    } else {
      // If already opened, just activate it
      await this.activateTab(file.path, triggerHistory);
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
        kind: 'view' as const,
        id: name,
        component: viewDef.component,
        title: viewDef.title
      };

      this.#tabStore.openTab(tabEntry);

      if (triggerHistory) {
        this.pageStore.pushPage(name);
      }
    } else {
      // If already opened, just activate it
      await this.activateTab(name, triggerHistory);
    }
  }

  async activateTab(tabId: string, triggerHistory = true) {
    const tab = this.#tabStore.tabs.find(t => t.id === tabId);
    if (!tab) return;

    this.#tabStore.openTab(tab);

    if (tab.kind === 'file') {
      const content = await this.files.readFile(tab.file);
      tab.file.content = content.content;
      tab.file.lastKnownTimestamp = content.timestamp;
    }
    if (triggerHistory) {
      this.pageStore.pushPage(tab.id);
    }
  }

  async closeTab(tabId: string) {
    const tab = this.#tabStore.tabs.find(t => t.id === tabId);
    if (!tab) return;

    // Close the tab in the store
    await this.#tabStore.closeTab(tab.id);
  }

  /**
	 * Method to sync changes between the server and the client
	 * @fires {@linkcode CoreAPI.tabs}
	 * @fires {@linkcode CoreAPI.activeTab}
	 */
  async syncStates(modifications: EntryModification[]) {
    await this.#tabStore.syncModifications(modifications);
    await this.foldState.syncModifications(modifications);

    for (const mod of modifications) {
      this.infoUi.addModificationMessage(mod);
    }
  }

  /**
	 * Method to write file content and update the corresponding tab's file content and timestamp.
	 * @fires {@linkcode CoreAPI.tabs} – the file tab is updated with new content and timestamp
	 * prefere this over directly using {@linkcode FileAPI.writeFile}
	 */
  async write(tab: TabFileEntry, content: string) {
    const ts = await this.files.writeFile(tab.file, content);
    tab.file.lastKnownTimestamp = ts;
  }

  async clear() {
    this.#tabStore.clear();
    this.foldState.clear();
  }
}

export type { CoreAPI };
export const coreAPI = new CoreAPI();