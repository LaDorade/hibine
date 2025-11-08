<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import EditorRenderer from './Editor/EditorRenderer.svelte';
</script>

{#if !coreAPI.pluginRegistry.initialized}
	<div class="w-full h-full flex flex-col items-center justify-center">
		<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900">
			<LoaderCircle strokeWidth={1.5} class="w-16 h-16 text-gray-600" />
		</div>
		Loading editor plugins...
	</div>
{:else}
	{#each coreAPI.tabs as tab (tab.id)}
		<div class:hidden={tab.id !== coreAPI.activeTab?.id} class="w-full h-full">
			{#if tab.kind === 'file'}
				<EditorRenderer bind:entry={tab.file} />
			{:else if tab.kind === 'plugin'}
				{@const plugin = coreAPI.pluginRegistry.getPlugin(tab.id)}
				{#if plugin}
					{@const ViewComponent = coreAPI.ui.viewItems.get(plugin?.id)}
					{#if ViewComponent}
						<ViewComponent {coreAPI} {tab} {plugin} />
					{:else}
						<div class="p-4">Plugin component not found</div>
					{/if}
				{:else}
					<div class="p-4">Plugin not found</div>
				{/if}
			{:else}
				<div class="p-4">Unknown Tab Type</div>
			{/if}
		</div>
	{:else}
		<div class="w-full h-full flex items-center justify-center text-gray-500">
			<div>No open tabs</div>
		</div>
	{/each}
{/if}
