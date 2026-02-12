<script lang="ts">
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { settings } from '$stores/Settings.svelte';
</script>

<div class="px-2 hidden md:block">
  <div
    class={[
      'flex justify-between items-center h-fit p-2 px-4',
      'bg-gray-800',
      'border-4 border-black border-b-0',
      'shadow-[4px_4px] shadow-black',
      'font-light text-sm',
      'text-gray-400',
      'text-xs',
      'group'
    ]}
  >
    {#key coreAPI.infoUi.lastMessage}
      <div class={['italic animate-fadeout group-hover:animate-none']}>
        {coreAPI.infoUi.lastMessage}
      </div>
    {/key}
    <div class="flex gap-2 items-center">
      {#if coreAPI.clientSocket?.socket?.connected}
        <span class="text-green-400">
          WS Connected {coreAPI.activeTab ? coreAPI.activeTabUsers : ''}
        </span>
      {:else}
        <span class="text-red-400">
          WS Disconnected
        </span>
      {/if}
      {#if settings.saveSet.saving}
        <span class="text-gray-500">
          Saving...
        </span>
      {:else}
        <span class="text-gray-400">
          All changes saved
        </span>
      {/if}
    </div>
  </div>
</div>
