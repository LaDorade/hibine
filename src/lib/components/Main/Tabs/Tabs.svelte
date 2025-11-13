<script lang="ts">
	import TabEntry from './TabEntry.svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';
</script>

{#if coreAPI.tabs.length > 0}
	<div
		role="tablist"
		aria-label="Open Tabs"
		class="flex bg-gray-900 border-b border-gray-800 h-12 relative overflow-x-auto overscroll-none scrollbar-hide"
	>
		{#each coreAPI.tabs as tab (tab.id)}
			<TabEntry {tab} />
		{/each}
	</div>
{/if}

<style>
	.scrollbar-hide {
		scrollbar-width: thin;
		scrollbar-color: #4b5563 #1f2937;
	}
</style>
