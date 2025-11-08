import type { Component } from 'svelte';
import type { FileEntry } from '$types/files';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginHooks } from './HookManager';

export type PluginKind = 'editor' | 'core' | 'ui' | 'service';

export type InitContext = {
	coreAPI: CoreAPI;
};

type BasePluginDefinition = {
	id: string;
	name: string;
	kind: PluginKind;
	init?(ctx: InitContext): Promise<void>;
	destroy?(): Promise<void>;
	hooks?: Partial<PluginHooks>;
};

export type PluginDefinition =
	| (BasePluginDefinition & {
			kind: 'editor';
			editor: EditorPlugin;
	  })
	| (BasePluginDefinition & {
			kind: 'core' | 'ui' | 'service';
			editor?: never;
	  });


export interface EditorPlugin {
	fileExtensions: string[];
	editor: Component<EditorPluginProps>;
}

/**
 * Props passed to editor plugin components
 */
export interface EditorPluginProps {
	file: FileEntry;
	coreAPI: CoreAPI;
	handleContentChange: (e: Event, file: FileEntry) => Promise<void>;
}