<script lang="ts">
	import { tick } from 'svelte';
	import { Folder, FolderOpen } from '@lucide/svelte';

	import { dropAndMove } from '$lib/attachments/drop';
	import { slide } from 'svelte/transition';
	import Entry from './Entry.svelte';
	import FileEntry from './FileEntry.svelte';
	import Self from './FolderEntry.svelte';
	import { dragStore } from '$stores/Drag.svelte';
	import type { FolderEntry } from '$types/files';
    import { coreAPI } from '$core/CoreAPI.svelte';

	type Props = {
		entry: FolderEntry;
	};

	let { entry }: Props = $props();

	let isOpen = $derived(coreAPI.foldState.isFolded(entry.path));

	async function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		coreAPI.foldState.toggleFold(entry.path);
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();

		const success = await dropAndMove(entry);
		if (!success) return;
		// await tick because filetreecomp is updated after a drop
		// otherwise it will open and close at the same time
		await tick();
		coreAPI.foldState.setFoldState(entry.path, true);
	}
</script>

<div
	class={[
		'flex flex-col',
	]}
	role="treeitem"
	tabindex="-1"
	aria-label={entry.name}
	aria-selected="false"
	aria-expanded={isOpen}
	draggable="true"
	ondragover={(e) => {
		e.preventDefault(); // ! Mandatory to allow drop event
	}}
	ondrop={handleDrop}
	ondragstart={(e) => {
		e.stopPropagation();

		dragStore.drag($state.snapshot(entry));
	}}
>
	<Entry {entry} onclick={handleClick} ondblclick={(e) => e.stopPropagation()}
		role="button"
	>
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
			role="group"
			aria-label={entry.name + ' contents'}
			class={[
				'flex duration-200 transition-all flex-col border-l',
				'md:border-transparent md:group-hover:border-gray-600 border-gray-600'
			]}
			transition:slide={{
				duration: 150,
			}}
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
