<script lang="ts">
  import { settings } from '$stores/Settings.svelte';
</script>

<div class="px-2 hidden md:block">
  <div
    class={[
      'flex justify-between items-center h-fit p-2 px-4',
      'bg-gray-800',
      'border-4 border-black border-b-0',
      'shadow-[4px_4px] shadow-black',
      'font-light text-sm'
    ]}
  >
    {#if settings.saveSet.saving}
      <span class="text-gray-500">
        Saving...
      </span>
    {:else}
      <span class="text-gray-400">
        Status: All changes saved
      </span>
    {/if}
  </div>
</div>
