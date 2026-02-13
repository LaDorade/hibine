<script lang="ts">
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { viewportStore } from '$stores/Viewport.svelte';
  import EditorRenderer from './Editor/EditorRenderer.svelte';
  import ViewRenderer from './View/ViewRenderer.svelte';

</script>

<!-- 
Can't use tab.id as a key, it causes some reactive issues 
The active tab editor will be destroyed but not remounted and so showing blank.
TODO: Maybe a svelte issue?
-->
{#each coreAPI.tabs as tab, index (index)}
  <div
    class={['overscroll-none overflow-hidden border-2 border-black',
      'shadow-[4px_4px] shadow-black',
      'bg-gray-800',
      'my-2 mr-2'
    ]}
    class:hidden={tab.id !== coreAPI.activeTab?.id}
    hidden={tab.id !== coreAPI.activeTab?.id}
    role="tabpanel"
    aria-labelledby={'tab-' + tab.id}
    id={'tabpanel-' + tab.id}
  >
    {#if tab.kind === 'file'}
      <EditorRenderer {tab} />
    {:else if tab.kind === 'view'}
      <ViewRenderer entry={tab} />
    {:else}
      <div class="p-4">Unknown Tab Type</div>
    {/if}
  </div>
{:else}
  <div class="w-full h-svh flex flex-col gap-4 items-center justify-center text-gray-500">
    <div>No open tabs</div>
    {#if !viewportStore.isMobile}
      <div class="flex justify-center items-center gap-2">
        <span class="text-gray-400">⌘+K</span> to open command palette
      </div>
    {/if}
  </div>
{/each}