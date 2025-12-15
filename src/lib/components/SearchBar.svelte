<script lang="ts">
  import { coreAPI } from '$core/CoreAPI.svelte';
  import * as Command from '$lib/components/ui/command';
  import { getFileTree } from '$lib/remotes/files.remote';
  import { computeCommandScore } from 'bits-ui';
  import type { FileEntry, FsNode } from '$types/files';

  interface Props {
    searchBarOpen: boolean;
  }
  let { searchBarOpen = $bindable() }: Props = $props();

  let open = $derived(searchBarOpen);
  let query = $state('');

  // generate "unnecessary waterfall warning" warning but seems legit 
  let files = $derived(toFlattenFiles(await getFileTree()) ?? []);
  let queryInFiles = $derived(
    files.some(
      (file) => file.path.toLowerCase() === query.toLowerCase(),
    ),
  );

  // TODO: move to a utility file
  function toFlattenFiles(
    files: FsNode[],
    parentPath: string = '',
  ): FileEntry[] {
    let flatList: FileEntry[] = [];
    for (const file of files) {
      const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
      if (file.type === 'file') {
        flatList.push({ ...file, path: currentPath });
      } else if (file.type === 'dir' && file.childs) {
        flatList = flatList.concat(toFlattenFiles(file.childs, currentPath));
      }
    }
    return flatList;
  }

  function filter(
    commandValue: string,
    search: string,
    commandKeywords?: string[],
  ): number {
    if (commandValue === '__new_file__') {
      // Always show the "Create new file" option
      return 0.0001;
    }
    const score = computeCommandScore(commandValue, search, commandKeywords);

    return score;
  }

  function openFile(entry: FileEntry) {
    open = false;
    coreAPI.openFile(entry);
    query = '';
  }

  function createAndOpenFile(fileName: string) {
    open = false;
    coreAPI.files.createAndOpenFile(fileName);
    query = '';
  }
</script>

<Command.Dialog bind:open {filter}>
  <Command.Input bind:value={query} placeholder="Search a file" />
  <Command.List>
    <Command.Group heading="Files">
      {#each files as entry (entry.path)}
        {#if entry.type === 'file'}
          <Command.Item
            value={entry.path}
            onSelect={() => openFile(entry)}
          >
            <div class="flex px-4 justify-between w-full">
              <span>
                {entry.name}
              </span>
              <span>
                {#if entry.path.indexOf('/') !== -1}
                  <span class="text-sm text-gray-500 italic">{entry.path}</span>
                {/if}
              </span>
            </div>
          </Command.Item>
        {/if}
      {/each}
    </Command.Group>
    {#if query}
      <Command.Separator />
      <Command.Group heading="Actions">
        <Command.Item
          class="font-medium mb-2"
          value="__new_file__"
          disabled={queryInFiles}
          onSelect={() => createAndOpenFile(query)}
        >
          <span> Create File: </span>
          <span class="font-bold">
            {query}
          </span>
        </Command.Item>
      </Command.Group>
    {/if}
  </Command.List>
</Command.Dialog>
