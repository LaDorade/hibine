import { SvelteMap } from 'svelte/reactivity';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginDefinition } from '$core/types';
import type { Component } from 'svelte';
import type { TabEntry } from './stores/TabStore.svelte';

export type SideBarComponentProps = {
	coreAPI: CoreAPI;
	plugin: PluginDefinition
}

export type ViewComponentProps = {
	coreAPI: CoreAPI;
	plugin: PluginDefinition;
	tab: TabEntry;
}

export type StatusBarComponentProps = {
	coreAPI: CoreAPI;
	plugin: PluginDefinition;
}

export class UIAPI {
	sideBarItems: SvelteMap<string, Component<SideBarComponentProps>> = new SvelteMap();
	viewItems: SvelteMap<string, Component<ViewComponentProps>> = new SvelteMap();
	statusBarItems: SvelteMap<string, Component<StatusBarComponentProps>> = new SvelteMap();

	constructor(private coreAPI: CoreAPI) {}

	registerSideBarComponent(id: string, comp: Component<SideBarComponentProps>) {
		this.sideBarItems.set(id, comp);
	}

	registerViewComponent(id: string, comp: Component<ViewComponentProps>) {
		this.viewItems.set(id, comp);
	}

	registerStatusBarComponent(id: string, comp: Component<StatusBarComponentProps>) {
		this.statusBarItems.set(id, comp);
	}
}