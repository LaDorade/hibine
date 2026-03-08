<script lang="ts">
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { Plus, Settings } from '@lucide/svelte';

  let newFileInput: string = $state('');

  export async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!newFileInput) return;

    const fileName = newFileInput.trim();
    if (!fileName) return;

    const res = await coreAPI.entries.createEntry(fileName)
      .catch((err) => {
        console.error('Error creating entry:', err);
        return null;
      });
    newFileInput = '';
    if (res && !res.isFolder) {
      coreAPI.openFileAtPath(res.newPath);
    }
  }
	
</script>

<div class="text-sm flex pb-4 px-4 gap-2">
  <form
    onsubmit={handleSubmit}
    class="flex w-full justify-between gap-2"
  >
    <input bind:value={newFileInput}
      {@attach (node) => node.focus()}
      data-testid="new-entry-input"
      type="text"
      placeholder="New file/folder..."
      autocomplete="off"
      class={['p-2 w-full bg-gray-800 focus:outline-none transition-all',
        'shadow-[2px_2px] shadow-black border border-black',
        'focus:shadow-[1px_1px] focus:bg-gray-900',
      ]}
    />
    <button
      data-testid="create-entry-button"
      type="submit"
      class={['p-2 flex justify-center items-center',
        'bg-gray-800 hover:bg-gray-700 border border-black',
        'shadow-[2px_2px] shadow-black hover:shadow-[1px_1px] transition-all',
        'cursor-pointer hover:bg-gray-900'
      ]}
    >
      <Plus strokeWidth={2} class="text-gray-400" />
    </button>
  </form>
  <button
    data-testid="settings"
    class={['p-2 flex justify-center items-center',
      'bg-gray-800 hover:bg-gray-700 border border-black',
      'shadow-[2px_2px] shadow-black hover:shadow-[1px_1px] transition-all',
      'cursor-pointer hover:bg-gray-900'
    ]}
    onclick={() => coreAPI.openView('settings')}
    type="button"
  >
    <Settings strokeWidth={1.5} class="text-gray-400" />
  </button>
</div>
