<script lang="ts">
  import { createFile } from '$lib/remotes/files.remote';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { FilePlus, FolderPlus, Plus, Settings, X } from '@lucide/svelte';

  let newFileInput: HTMLInputElement | null = $state(null);

  export function focusInput() {
    if (newFileInput) {
      newFileInput.focus();
    }
  }

  async function enhanceForm({form, submit}: {form: HTMLFormElement, submit: () => Promise<void>}) {
    try {
      await submit();
      form.reset();
      if (!createFile.result) {
        return;
      }
    } catch (error) {
      console.error('Error creating file:', error);
    }
  }
	
  // TODO: refacto, this will retrigger when open the page
	// This causes an issue when we close the created file
  $effect(() => {
    if (createFile.result) {
      coreAPI.openFile(createFile.result);
    }
  });
</script>

<div class="text-sm">
  <form
    {...createFile.enhance(enhanceForm)}
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
        }}>
          <X
            class="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer"
          />
        </button>
      </div>
    {/if}
    <div class="pb-2 pl-4 pr-2 flex justify-between items-center gap-4">
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
        class="w-full p-2 py-1 bg-gray-700
          text-gray-400
          focus:text-gray-200
          hover:ring-green-500 transition-all
          rounded-md focus:outline-none
          peer focus:ring-1 focus:ring-green-500
        "
      />
      <button
        data-testid="create-entry-button"
        {...createFile.buttonProps}
        class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
          hover:bg-gray-600 hover:border-green-500 transition-all"
      >
        <Plus strokeWidth={1} class="text-gray-200" />
      </button>
    </div>
  </form>

  <div
    class={['p-2 flex items-center justify-between gap-2',
      'border-t-4 border-black',
      'transition-all duration-150',
    ]}
  >
    <div class="flex gap-2 items-center">
      <button
        onclick={() => focusInput()}
        class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
          hover:bg-gray-600 hover:border-green-500 transition-all"
      >
        <FilePlus strokeWidth={1} class="text-gray-200" />
      </button>
      <button
        onclick={() => focusInput()}
        class="cursor-pointer w-8 h-8 p-1 flex justify-center items-center rounded-lg
          hover:bg-gray-600 hover:border-green-500 transition-all"
      >
        <FolderPlus strokeWidth={1} class="text-gray-200" />
      </button>
    </div>
    <button
      onclick={() => coreAPI.openView('settings')}
      class={[
        'w-8 h-8 p-1 flex justify-center items-center rounded-lg',
        'backdrop-hue-rotate-90',
        'hover:bg-white/10 hover:border-green-500 transition-all cursor-pointer'
      ]}
    >
      <Settings strokeWidth={1} class="text-gray-200" />
    </button>
  </div>
</div>
