<script lang="ts">
		import FileEntry from './FileEntry.svelte';
		import FolderEntry from './FolderEntry.svelte';
    import { dropAndMove } from '$lib/attachments/drop';
    import { getFileTree, getCurrentTape } from '$lib/remotes/files.remote';
    import type { FileTree } from '$types/files';
    import { stopEvent } from '$lib/utils';

		let tree = $derived(await getFileTree() ?? []);
		let files = $derived(sortFileTree(tree));

		// TODO: use design pattern strategy for multiple sorting methods
		function sortFileTree(entries: FileTree[]): FileTree[] {
			let fileTree = entries.toSorted((a, b) => {
				if (a.type === b.type) {
					return a.name.localeCompare(b.name);
				}
				return a.type === 'dir' ? -1 : 1;
			});
			fileTree.forEach(entry => {
				if (entry.type === 'dir' && entry.childs) {
					entry.childs = sortFileTree(entry.childs);
				}
			});
			return fileTree;
		}

		async function handleDrop(e: DragEvent) {
			stopEvent(e);
			const tape = await getCurrentTape();
			await dropAndMove({ name: tape, path: '', type: 'dir', childs: files });
		}
</script>

<ul
    class="h-full overflow-hidden rounded flex flex-col group text-sm p-2"
    role="tree"
		aria-multiselectable="true"
		tabindex="-1"
		aria-label="File Tree"
    ondragover={(e: DragEvent) => e.preventDefault()}
    ondrop={handleDrop}
>
    <!-- File/Folder list -->
    {#each files as entry (entry.path)}
			<li role="none">
				{#if entry.type === 'file'}
					<FileEntry {entry} />
				{:else if entry.type === 'dir'}
					<FolderEntry {entry} />
				{/if}
			</li>
    {/each}
</ul>
