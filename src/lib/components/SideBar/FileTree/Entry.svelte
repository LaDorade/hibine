<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { clickOutside } from '$lib/attachments/clickOutside';
	import * as Context from '$lib/components/ui/context-menu';

	import type { ContextMenuTriggerProps } from 'bits-ui';
	import type { FileEntry, FolderEntry } from '$types/files';

	const { removeEntry, renameEntry } = coreAPI.entries;

	type Props = ContextMenuTriggerProps & {
		icon: Snippet;
		entry: FileEntry | FolderEntry;
		className?: string;
	};
	let { icon, className, entry, ...props }: Props = $props();

	let renaming = $state(false);
	let newName = $state(entry.name);

	let open = $state(false);

	function handleClickOutside(node: HTMLElement) {
		return clickOutside(node, () => {
			renaming = false;
			newName = '';
		});
	}
</script>

<Context.Root bind:open>
	<Context.Trigger
		data-testid={`file-tree-entry-${entry.name}`}
		class="flex gap-2 items-center p-2 md:py-0 text-sm cursor-pointer group relative text-gray-200
		rounded-sm hover:bg-gray-600 hover:border-green-500
		transition-all duration-150 w-full
		{className}"
		{...props}
	>
		{@render icon?.()}
		{#if renaming}
			<input
				data-testid="rename-entry-input"
				{@attach (e) => {
					tick().then(() => {
						e.focus();
						e.select();
					});
				}}
				{@attach handleClickOutside}
				bind:value={newName}
				type="text"
				class="text-gray-200 focus:outline-none w-full"
				onkeydown={async (e) => {
					if (e.key === 'Enter') {
						renaming = false;
						await renameEntry(entry.path, newName);
					}
				}}
			/>
		{:else}
			<span>
				{entry.name}
			</span>
		{/if}
	</Context.Trigger>
	<Context.Content>
		<Context.Item
			data-testid="rename-entry-button"
			inset
			onclick={(e) => {
				e.stopPropagation();
				renaming = true;
			}}
		>
			Rename
		</Context.Item>
		<Context.Item
			data-testid="delete-entry-button"
			inset
			onclick={async (e) => {
				e.stopPropagation();
				open = false;
				await removeEntry(entry.path);
			}}
		>
			Delete
		</Context.Item>
	</Context.Content>
</Context.Root>
