<script lang="ts">
  import { ChevronRight } from '@lucide/svelte';
  import { coreAPI } from '$core/CoreAPI.svelte';

  const activeTab = $derived(coreAPI.activeTab);

  let activeFilePath = $derived(
    activeTab?.kind === 'file' ? activeTab?.file.path.split('/') : [],
  );

  let nbSegment = $derived(activeFilePath?.length);
</script>

{#if activeFilePath.length}
  <div
    aria-label="breadcrumb"
    data-testid="breadcrumb"
    class={[
      'flex gap-1 px-2 mt-2 w-fit',
      'text-sm',
      'items-center',
      'text-gray-400',
      'bg-gray-800/50',
      'border-2 border-black/50',
      'shadow-[4px_4px] shadow-black/50'
    ]}
  >
    {#each activeFilePath || '' as segment, index (index)}
      {#if index !== nbSegment - 1}
        <span class="text-gray-400">{segment}</span>
        <span><ChevronRight class="w-4 h-4" strokeWidth={1} /></span>
      {:else}
        <span class="text-gray-200">{segment}</span>
      {/if}
    {/each}
  </div>
{:else if activeTab?.kind === 'view' && activeTab?.id}
  <div
    aria-label="breadcrumb"
    data-testid="breadcrumb"
    class={[
      'flex gap-1 px-2 mt-2 w-fit',
      'text-sm',
      'items-center',
      'text-gray-400',
      'bg-gray-800/50',
      'border-2 border-black/50',
      'shadow-[4px_4px] shadow-black/50'
    ]}
  >
    <span class="text-gray-200">View: {activeTab.title}</span>	
  </div>
{/if}
