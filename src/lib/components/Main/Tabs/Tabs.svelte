<script lang="ts">
  import TabEntry from './TabEntry.svelte';
  import { coreAPI } from '$core/CoreAPI.svelte';
</script>

{#if coreAPI.tabs.length > 0}
  <div
    role="tablist"
    aria-label="Open Tabs"
    class={['flex h-14 md:mt-2 md:mr-2 relative overflow-x-auto overscroll-none scrollbar-hide',
      'border-2 border-black bg-gray-800',
      'shadow-[4px_4px] shadow-black'
    ]}
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
