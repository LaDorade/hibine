<script lang="ts">
  import { createFile } from '$lib/remotes/files.remote';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { Plus, Settings, X } from '@lucide/svelte';

  let newFileInput: HTMLInputElement | null = $state(null);

  export function focusInput() {
    if (newFileInput) {
      newFileInput.focus();
    }
  }
	
  let lastCreatedPath = '';
  $effect(() => {
    if (createFile.result && 
      createFile.result.type === 'file' &&
      lastCreatedPath !== createFile.result.path
    ) {
      lastCreatedPath = createFile.result.path;
      coreAPI.openFile(createFile.result);
    }
  });
</script>

<div class="text-sm">
  <form
    {...createFile}
    class="flex flex-col w-full"
  >
    {#if createFile.fields.allIssues()?.length}
      <div class="px-4 p-1 flex justify-between items-center">
        {#each createFile.fields.fileName.issues() as issue (issue.message)}
          <span class="text-xs text-red-500">{issue.message}</span>
        {/each}
        <button type="button" onclick={() => {
          createFile.validate();
          focusInput();
        }} class={['px-2']}>
          <X
            strokeWidth={2}
            class="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer"
          />
        </button>
      </div>
    {/if}
    <div class="pb-4 px-4 flex justify-between gap-2">
      <input
        data-testid="new-entry-input"
        bind:this={newFileInput}
        {...createFile.fields.fileName.as('text')}
        oninput={() => 
          // this resets errors when user types
          createFile.validate()
        }
        placeholder="New file/folder..."
        autocomplete="off"
        class={['p-2 w-full bg-gray-800 focus:outline-none transition-all',
          'shadow-[2px_2px] shadow-black border border-black',
          'focus:shadow-[1px_1px] focus:bg-gray-900',
        ]}
      />
      <button
        data-testid="create-entry-button"
        {...createFile.buttonProps}
        class={['p-2 flex justify-center items-center',
          'bg-gray-800 hover:bg-gray-700 border border-black',
          'shadow-[2px_2px] shadow-black hover:shadow-[1px_1px] transition-all',
          'cursor-pointer hover:bg-gray-900'
        ]}
      >
        <Plus strokeWidth={2} class="text-gray-400" />
      </button>
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
  </form>
</div>
