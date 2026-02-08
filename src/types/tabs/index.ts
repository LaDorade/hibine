import type { FileEntry } from '$types/files';
import type { Component } from 'svelte';

export type TabKind = 'file' | 'view';

interface BaseTabEntry {
  id: string; // unique
  kind: TabKind;
  title: string;
}

export type TabViewEntry = BaseTabEntry & {
	kind: 'view';
	component: Component;
}
export type TabFileEntry = BaseTabEntry & {
	kind: 'file';
	file: FileEntry;
}

export type TabEntry = TabViewEntry | TabFileEntry;

