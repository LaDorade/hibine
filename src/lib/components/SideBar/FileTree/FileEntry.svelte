<script lang="ts">
	import { Disc3 } from '@lucide/svelte';
	import Entry from './Entry.svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { dragStore } from '$stores/Drag.svelte';
	import type { FileEntry } from '$types/files';

	type Props = {
		entry: FileEntry;
	};

	let { entry }: Props = $props();
</script>

<Entry
	{entry}
	draggable="true"
	ondragstart={(e) => {
		e.stopPropagation();
		dragStore.drag($state.snapshot(entry));
	}}
	onclick={async (e) => {
		e.preventDefault();
		e.stopPropagation();
		await coreAPI.openFile(entry);
	}}
	ondblclick={(e) => {
		e.stopPropagation();
	}}
	className={coreAPI.isActiveTab(entry.path)
		? ' bg-green-400/10'
		: ''}
>
	{#snippet icon()}
		<span class="">
			<Disc3 strokeWidth={1.2} class={[
				'w-4',
			]} />
		</span>
	{/snippet}
</Entry>
