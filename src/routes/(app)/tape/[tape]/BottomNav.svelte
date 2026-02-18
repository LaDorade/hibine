<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import Header from '$components/SideBar/Header.svelte';
  import SideBar from '$components/SideBar/SideBar.svelte';
  import * as Drawer from '$components/ui/drawer';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { viewportStore } from '$stores/Viewport.svelte.js';
  import { FilePlus, FolderTree, Settings } from '@lucide/svelte';

  onNavigate(() => {
    viewportStore.isMobileSidebarOpen = false;
  });
</script>

<div class={[
  'border-t',
  coreAPI.clientSocket?.socket.connected ? 'border-green-400/40' : 'border-red-500/80',
  'md:hidden grow w-full h-12 z-10 grid grid-flow-col items-center',
]}>
  <button
    onclick={() => {
      const newFile = prompt('New file name');
      if (!newFile) return;

      coreAPI.files.createAndOpenFile(newFile);
    }}
    class="w-full h-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
      bg-gray-800 "
  >
    <FilePlus strokeWidth={1} />
  </button>
  <button
    onclick={() => {
      coreAPI.openView('settings');
    }}
    class="w-full h-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
      bg-gray-800"
  >
    <Settings strokeWidth={1} />
  </button>
  <Drawer.Root bind:open={viewportStore.isMobileSidebarOpen}>
    <Drawer.Trigger
      class="h-full w-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
        bg-gray-800"
    >
      <FolderTree strokeWidth={1} />
    </Drawer.Trigger>
    <Drawer.Content class="bg-gray-900 text-gray-200 font-sans p-4">
      <SideBar className="bg-gray-800 rounded">
        {#snippet header()}
          <div class="flex justify-between h-12">
            <Header />
          </div>
        {/snippet}
      </SideBar>
    </Drawer.Content>
    <Drawer.Overlay class="fixed inset-0 bg-black/50" />
  </Drawer.Root>
</div>
