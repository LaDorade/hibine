<script lang="ts">
    import { dropAndMove } from '$lib/attachments/drop';
    import { onMount } from 'svelte';
    import FileEntry from './FileEntry.svelte';
    import FolderEntry from './FolderEntry.svelte';
    import { getFileTree, getCurrentTape } from '$lib/remotes/files.remote';
    import { foldStateStore } from '$stores/FoldState.svelte';

    type Props = {
        handleDblClick?: (_: MouseEvent | KeyboardEvent) => void;
    };

    let { handleDblClick }: Props = $props();

		let files = $derived(await getFileTree() ?? []);
		
		async function handleDrop(e: DragEvent) {
			e.preventDefault();
			e.stopPropagation();
			const tape = await getCurrentTape();
			await dropAndMove({ name: tape, path: '', type: 'dir', childs: files });
		}
    onMount(() => {
    	foldStateStore.init();
    });
</script>

<div
    class="h-full overflow-hidden rounded flex flex-col group text-sm p-2"
    ondragenter={(_) => {
    	// Todo: style
    	// e.currentTarget.classList.add("bg-gray-600");
    }}
    ondragleave={(_) => {
    	// Todo: style
    	// e.currentTarget.classList.remove("bg-gray-600");
    }}
    ondragover={(e) => e.preventDefault()}
    ondrop={handleDrop}
    role="region"
    ondblclick={(e) => {
    	handleDblClick?.(e);
    }}
>
    <!-- File/Folder list -->
    {#each files as entry (entry.path)}
        {#if entry.type === 'file'}
            <FileEntry {entry} />
        {:else if entry.type === 'dir'}
            <FolderEntry {entry} />
        {/if}
    {/each}
</div>
