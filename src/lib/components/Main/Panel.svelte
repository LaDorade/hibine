<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import EditorRenderer from './Editor/EditorRenderer.svelte';
	import ViewRenderer from './View/ViewRenderer.svelte';

</script>

{#each coreAPI.tabs as tab (tab.id)}
	<div
		class="w-full h-full"
		class:hidden={tab.id !== coreAPI.activeTab?.id}
		hidden={tab.id !== coreAPI.activeTab?.id}
		role="tabpanel"
		aria-labelledby={'tab-' + tab.id}
		id={'tabpanel-' + tab.id}
	>
		{#if tab.kind === 'file'}
			<EditorRenderer bind:entry={tab.file} />
		{:else if tab.kind === 'view'}
			<ViewRenderer entry={tab} />
		{:else}
			<div class="p-4">Unknown Tab Type</div>
		{/if}
	</div>
{:else}
	<div class="w-full h-full flex items-center justify-center text-gray-500">
		<div>No open tabs</div>
	</div>
{/each}
