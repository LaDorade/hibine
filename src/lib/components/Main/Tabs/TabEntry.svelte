<script lang="ts">
  import { X } from '@lucide/svelte';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { stopEvent } from '$lib/utils';
  import type { TabEntry } from '$core/internal/stores/TabStore.svelte';

  type Props = {
    tab: TabEntry;
  };
  let { tab }: Props = $props();

  function hasNameInCommon(entry: TabEntry): boolean {
    const openTabs = coreAPI.tabs;
    if (openTabs.length <= 1) return false;

    const nameCount = openTabs.reduce((count, file) => {
      if (file.title === entry.title) {
        return count + 1;
      }
      return count;
    }, 0);

    return nameCount > 1;
  }

  function scrollToView(entry: TabEntry) {
    return (node: HTMLDivElement) => {
      if (entry.id === coreAPI.activeTab?.id) {
        node.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
          inline: 'center',
        });
      }
    };
  }

  async function onTabClick(e: MouseEvent) {
    stopEvent(e);
    if (e.button === 0) {
      await coreAPI.activateTab(tab.id);
    }
  }
  async function onTabAuxClick(e: MouseEvent) {
    if (e.button === 1) {
      // middle click
      await coreAPI.closeTab(tab.id);
    }
  }

  async function onCloseClick(e: MouseEvent) {
    stopEvent(e);
    await coreAPI.closeTab(tab.id);
  }
</script>

<div
	{@attach scrollToView(tab)}
  role="tab"
  aria-selected={coreAPI.activeTab?.id === tab.id}
  aria-label={tab.title}
  aria-controls={'tabpanel-' + tab.id}
  id={'tab-' + tab.id}
  class="flex h-full justify-between items-center relative border-y-4 border-t-transparent
    {coreAPI.activeTab?.id === tab.id
      ? ' border-green-400/50'
      : ' hover:bg-gray-750 border-transparent hover:border-b-gray-600'} 
    min-w-[120px] max-w-[180px]
    md:min-w-[180px] md:max-w-60
    border-r-2 border-r-black
  "
>
  <button
    onclick={onTabClick}
    onauxclick={onTabAuxClick}
    class={[
      'flex grow h-full w-full items-center cursor-pointer font-medium',
      'text-gray-200 transition-all duration-200 px-4 truncate text-ellipsis',
      coreAPI.activeTab?.id === tab.id ? 'text-green-100' : 'hover:text-white',
    ]}
  >
    <div class="flex items-center text-sm gap-1 min-w-0">
      <!-- File name -->
      {#if hasNameInCommon(tab) && 'file' in tab}
        {@const parentDir = tab.file.path.split('/').at(-2)}
        <span class="text-xs text-gray-400 italic">
          {parentDir ? `.../${parentDir}/` : './'}
        </span>
      {/if}
      <span class="truncate">{tab.title}</span>
    </div>
  </button>
  <button
    class={[
      'w-fit h-full flex justify-center items-center',
      'cursor-pointer',
      'text-gray-500 hover:text-gray-300',
    ]}
    onclick={onCloseClick}
    aria-label="Close tab"
  >
    <X class="w-12" />
  </button>
</div>
