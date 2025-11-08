<script lang="ts">
	import { tick } from 'svelte';
	import { Folder, FolderOpen } from '@lucide/svelte';

	import { dropAndMove } from '$lib/attachments/drop';
	import { slide } from 'svelte/transition';
	import Entry from './Entry.svelte';
	import FileEntry from './FileEntry.svelte';
	import Self from './FolderEntry.svelte';
	import { dragStore } from '$stores/Drag.svelte';
	import { foldStateStore } from '$stores/FoldState.svelte';
	import type { FolderEntry } from '$types/files';

	type Props = {
		entry: FolderEntry;
	};

	let { entry }: Props = $props();

	let isOpen = $derived(foldStateStore.isFolded(entry.path));

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		foldStateStore.toggleFold(entry.path);
		// TODO Use OPTIONS to set the behavior of click/double click
		// TODO see if usefull
		// if (e.detail === 1) {
		//     isOpen = !isOpen;
		// } else if (e.detail === 2) {
		//     // double click
		// } else if (e.detail === 3) {
		//     // triple click
		//     // renaming of file/folder ?
		// }
		// e.stopImmediatePropagation();
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();

		const success = await dropAndMove(entry);
		if (!success) return;
		// await tick because filetreecomp is updated after a drop
		// otherwise it will open and close at the same time
		await tick();
		foldStateStore.setFoldState(entry.path, true);
	}
</script>

<div
	class="flex flex-col"
	draggable="true"
	ondragenter={(_) => {
		// Todo: style
		// e.currentTarget.classList.add("bg-gray-600");
	}}
	ondragleave={(_) => {
		// Todo: style
		// e.currentTarget.classList.remove("bg-gray-600");
	}}
	ondragover={(e) => {
		e.preventDefault(); // ! Mandatory to allow drop event
	}}
	ondrop={handleDrop}
	ondragstart={(e) => {
		e.stopPropagation();

		dragStore.drag($state.snapshot(entry));
	}}
	role="region"
>
	<Entry {entry} onclick={handleClick} ondblclick={(e) => e.stopPropagation()}>
		{#snippet icon()}
			<span>
				{#if isOpen}
					<FolderOpen strokeWidth={2} class="w-4 stroke-green-500 " />
				{:else}
					<Folder
						strokeWidth={2}
						class="w-4 stroke-transparent fill-green-500"
					/>
				{/if}
			</span>
		{/snippet}
	</Entry>
	{#if entry.childs?.length && isOpen}
		<div
			transition:slide={{
				duration: 150,
			}}
			class="flex duration-200 transition-all flex-col gap-1 border-l
            md:border-transparent md:group-hover:border-gray-600 border-gray-600"
		>
			{#each entry.childs ?? [] as child (child.path)}
				<div class="pl-4">
					{#if child.type === 'file'}
						<FileEntry entry={child} />
					{:else if child.type === 'dir'}
						<div class="flex flex-col gap-1">
							<Self entry={child} />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
