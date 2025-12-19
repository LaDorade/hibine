import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FileEntry } from '$types/files';
import type { Component } from 'svelte';
import type { EntryModification } from '$types/modification';

export enum TabKindEnum {
	FILE = 'file',
	VIEW = 'view',
}

interface BaseTabEntry {
  id: string; // unique
  kind: TabKindEnum;
  title: string;
}

export type TabViewEntry = BaseTabEntry & {
	kind: TabKindEnum.VIEW;
	component: Component;
}
export type TabFileEntry = BaseTabEntry & {
	kind: TabKindEnum.FILE;
	file: FileEntry;
}

export type TabEntry = TabViewEntry | TabFileEntry;


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
      }
    }
    this.tabs = afterTabs;
  }

  async syncModifications(changes: EntryModification[]) {
    for (const change of changes) {
      if (change.type === 'moved' || (change.type === 'renamed' && change.isFolder)) {
        const linkedTabs = this.tabs.filter(f => f.id.startsWith(change.oldPath));
        for (const tab of linkedTabs) {
          const relativePath = tab.id.slice(change.oldPath.length);
          const newPath = change.newPath + relativePath;
          
          if (tab.kind === 'file') {
            tab.file.path = newPath;
          }
          tab.id = newPath;

          if (this.activeTabId?.startsWith(change.oldPath)) {
            this.activeTabId = tab.id;
          }
        }
        this.tabs = [...this.tabs];
      } else if (change.type === 'renamed') {
        let tab = this.tabs.find(f => f.id === change.oldPath);
        const tabName = change.newPath.split('/').pop();
        if (tab && tabName) {
          if (tab.kind === 'file') {
            tab = {
              ...tab,
              title: tabName,
              file: {
                ...tab.file,
                name: tabName,
                path: change.newPath,
              }
            };
          }
          tab.id = change.newPath;

          if (this.activeTabId === change.oldPath) {
            this.activeTabId = change.newPath;
          }

          this.tabs = [...this.tabs.map(f => f.id === change.oldPath ? tab! : f)];
        }
      } else if (change.type === 'removed') {
        if (change.isFolder) {
          this.tabs = this.tabs.filter(f => !f.id.startsWith(change.oldPath));
          if (this.activeTabId?.startsWith(change.oldPath)) {
            await this.closeTab(this.activeTabId);
          }
        } else {
          this.tabs = this.tabs.filter(f => f.id !== change.oldPath);
          if (this.activeTabId === change.oldPath) {
            await this.closeTab(this.activeTabId);
          }
        }
      }
    }
  }

  clear() {
    this.tabs = [];
    this.activeTabId = null;
  }
}