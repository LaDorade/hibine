import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { EntryModification } from '$types/modification';
import { type TabEntry } from '$types/tabs';

export type ActiveTabInfos = {
	id: string;
	usersNb?: number;
	editable?: boolean;
}

export class TabStore {
  tabs: TabEntry[] = $state([]);
  activeTabInfos: ActiveTabInfos | null = $state(null);
  activeTab: TabEntry | null = $derived.by(() => {
    if (this.activeTabInfos?.id) {
      return this.tabs.find(t => t.id === this.activeTabInfos?.id) || null;
    }
    return null;
  });
	
  constructor(private core: CoreAPI) {}

  async openTab(tab: TabEntry) {
    if (!this.tabs.find(t => t.id === tab.id)) {
      this.tabs.push(tab);
    }
    this.activeTabInfos = {
      id: tab.id,
    };

    this.core.clientSocket?.socket.emit('tab-opened', { 
      id: tab.id,
      kind: tab.kind
    }, (users: number) => {
      if (!this.activeTabInfos) return;
      this.activeTabInfos.usersNb = users;
    });
  }
  async closeTab(tabId: string) {
    const tab = this.getTab(tabId);
    const afterTabs = this.tabs.filter(t => t.id !== tabId);
    if (this.activeTabInfos?.id === tabId) {
      const newActiveTab = afterTabs.length > 0 ? afterTabs[0] : null;
      if (newActiveTab) {
        this.core.activateTab(newActiveTab.id);
      } else {
        this.activeTabInfos = null;
        this.core.pageStore.pushPage(null);
      }
    }


    this.tabs = afterTabs;
    this.core.clientSocket?.socket.emit('tab-closed', { 
      id: tab!.id,
      kind: tab!.kind
    });
  }

  getTab(id: string): TabEntry | undefined {
    return this.tabs.find(t => t.id === id);
  }

  async syncModifications(changes: EntryModification[]) {
    let updatedTabs = this.tabs;
    let newActiveTabInfos = this.activeTabInfos;

    for (const change of changes) {
      if (change.type === 'moved' || (change.type === 'renamed' && change.isFolder)) {
        updatedTabs = updatedTabs.map(tab => {
          if (!tab.id.startsWith(change.oldPath)) return tab;

          const relativePath = tab.id.slice(change.oldPath.length);
          const newPath = change.newPath + relativePath;
          const newName = newPath.split('/').pop() || tab.title;

          if (tab.kind === 'file') {
            return {
              ...tab,
              id: newPath,
              title: newName,
              file: {
                ...tab.file,
                name: newName,
                path: newPath,
              }
            };
          } else {
            return {
              ...tab,
              id: newPath,
              title: newName,
            };
          }
        });

        if (newActiveTabInfos?.id.startsWith(change.oldPath)) {
          const relativePath = newActiveTabInfos.id.slice(change.oldPath.length);
          newActiveTabInfos.id = change.newPath + relativePath;
        }

      } else if (change.type === 'renamed' && !change.isFolder) {
        const newName = change.newPath.split('/').pop();
        if (!newName) continue;

        updatedTabs = updatedTabs.map(tab => {
          if (tab.id !== change.oldPath) return tab;

          if (tab.kind === 'file') {
            return {
              ...tab,
              id: change.newPath,
              title: newName,
              file: {
                ...tab.file,
                name: newName,
                path: change.newPath,
              }
            };
          } else {
            return {
              ...tab,
              id: change.newPath,
              title: newName,
            };
          }
        });

        if (newActiveTabInfos?.id === change.oldPath) {
          // todo: request if new file is editable/nbofusers
          newActiveTabInfos.id = change.newPath;
        }

      } else if (change.type === 'removed') {
        const shouldRemove = change.isFolder
          ? (tab: TabEntry) => tab.id.startsWith(change.oldPath)
          : (tab: TabEntry) => tab.id === change.oldPath;

        const tabsToRemove = updatedTabs.filter(shouldRemove);
        updatedTabs = updatedTabs.filter(tab => !shouldRemove(tab));

        if (tabsToRemove.some(tab => tab.id === newActiveTabInfos?.id)) {
          if (updatedTabs.length > 0) {
						newActiveTabInfos!.id = updatedTabs!.at(0)!.id;
          } else {
            newActiveTabInfos = null;
          }
        }
      }
    }

    this.tabs = updatedTabs;
    if (newActiveTabInfos) {
      this.core.activateTab(newActiveTabInfos.id, false);
    }
    this.activeTabInfos = newActiveTabInfos;
    this.core.pageStore.replacePage(this.activeTabInfos?.id);
  }

  clear() {
    this.tabs = [];
    this.activeTabInfos = null;
  }
}