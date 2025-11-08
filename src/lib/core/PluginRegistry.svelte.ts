import { SvelteMap } from 'svelte/reactivity';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginDefinition, PluginKind } from './types';
import type { HookManager } from './HookManager';

export class PluginRegistry {
	private plugins: Map<string, PluginDefinition> = new SvelteMap();
	readonly core: CoreAPI;
	readonly hookManager: HookManager;
	public initialized: boolean = $state(false);

	constructor(core: CoreAPI, hookManager: HookManager) {
		this.core = core;
		this.hookManager = hookManager;
	}

	async init(): Promise<void> {
		// Register default editors and services

		const defaultEditors = await import('$plugins/Editors');
		for (const pluginKey in defaultEditors) {
			const plugin = (defaultEditors as Record<string, PluginDefinition>)[pluginKey];
			this.register(plugin);
		}
		const defaultServices = await import('$plugins/Services');
		for (const pluginKey in defaultServices) {
			const plugin = (defaultServices as Record<string, PluginDefinition>)[pluginKey];
			this.register(plugin);
		}

		await new Promise(resolve => setTimeout(resolve, 1000));
		this.initialized = true;
	}

	register(plugin: PluginDefinition): void {
		if (this.plugins.has(plugin.id)) {
			console.warn(`Plugin with id '${plugin.id}' is already registered. Overwriting.`);
		}
		this.plugins.set(plugin.id, plugin);

		// Initialize plugin
		plugin.init?.({ coreAPI: this.core });
		for (const hookName in plugin.hooks) {
			const hook = hookName as keyof typeof plugin.hooks;
			const handler = plugin.hooks[hook];
			if (handler) {
				this.hookManager.register(hook, handler);
			}
		}
	}
	
	unregister(pluginId: string): void {
		this.plugins.delete(pluginId);
	}
	
	getPlugin(pluginId: string): PluginDefinition | undefined {
		return this.plugins.get(pluginId);
	}
	
	getAllPlugins(): PluginDefinition[] {
		return Array.from(this.plugins.values());
	}

	getPluginsByKind<T extends PluginKind>(kind: T): (PluginDefinition & { kind: T })[] {
		return Array.from(this.plugins.values())
			.filter(plugin => plugin.kind === kind) as (PluginDefinition & { kind: T })[];
	}

	resolveEditorPlugin(extensions: string): PluginDefinition & { kind: 'editor' } | undefined {
		let starPlugin: PluginDefinition & { kind: 'editor' } | undefined;

		for (const plugin of this.getPluginsByKind('editor')) {
			if (plugin.editor.fileExtensions.some(ext => ext === extensions)) {
				return plugin;
			} else if (plugin.editor.fileExtensions.includes('*') && !starPlugin) {
				starPlugin = plugin;
			}
		}
		return starPlugin;
	}
}
