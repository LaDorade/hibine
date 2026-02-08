import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { EntryModification } from '$types/modification';
import { type TabEntry } from '$types/tabs';

export class TabStore {
  tabs: TabEntry[] = $state([]);
  activeTabId: string | null = $state(null);
  activeTab: TabEntry | null = $derived.by(() => {
    if (this.activeTabId) {
      return this.tabs.find(t => t.id === this.activeTabId) || null;
    }
    return null;
  });
	
  constructor(private core: CoreAPI) {}

  async openTab(tab: TabEntry) {
    if (!this.tabs.find(t => t.id === tab.id)) {
      this.tabs.push(tab);
    }
    this.activeTabId = tab.id;
    this.tabs = [...this.tabs];
  }
  async closeTab(tabId: string) {
    const afterTabs = this.tabs.filter(t => t.id !== tabId);
    if (this.activeTabId === tabId) {
      const newActiveTab = afterTabs.length > 0 ? afterTabs[0] : null;
      if (newActiveTab) {
        this.core.activateTab(newActiveTab.id);
      } else {
        this.activeTabId = null;
        this.core.pageStore.pushPage(null);
      }
    }
    this.tabs = afterTabs;
  }

  async syncModifications(changes: EntryModification[]) {
    let updatedTabs = this.tabs;
    let newActiveTabId = this.activeTabId;

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

        if (newActiveTabId?.startsWith(change.oldPath)) {
          const relativePath = newActiveTabId.slice(change.oldPath.length);
          newActiveTabId = change.newPath + relativePath;
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

        if (newActiveTabId === change.oldPath) {
          newActiveTabId = change.newPath;
        }

      } else if (change.type === 'removed') {
        const shouldRemove = change.isFolder
          ? (tab: TabEntry) => tab.id.startsWith(change.oldPath)
          : (tab: TabEntry) => tab.id === change.oldPath;

        const tabsToRemove = updatedTabs.filter(shouldRemove);
        updatedTabs = updatedTabs.filter(tab => !shouldRemove(tab));

        if (tabsToRemove.some(tab => tab.id === newActiveTabId)) {
          newActiveTabId = updatedTabs.length > 0 ? updatedTabs[0].id : null;
        }
      }
    }

    this.tabs = updatedTabs;
    this.activeTabId = newActiveTabId;
    this.core.pageStore.replacePage(this.activeTabId);
  }

  clear() {
    this.tabs = [];
    this.activeTabId = null;
  }
}