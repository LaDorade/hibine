<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { clickOutside } from '$lib/attachments/clickOutside';
	import * as Context from '$lib/components/ui/context-menu';

	import type { FileEntry, FolderEntry } from '$types/files';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const { removeEntry, renameEntry } = coreAPI.entries;

	type Props = HTMLButtonAttributes & {
		icon: Snippet;
		entry: FileEntry | FolderEntry;
		className?: string;
		onclick?: (_: MouseEvent) => Promise<void>;
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

	async function handleClick(e: MouseEvent) {
		if (e.shiftKey) {
			// range selection
			coreAPI.selectedStore.rangeTo(entry.path);
			return;
		}
		if (e.ctrlKey || e.metaKey) {
			coreAPI.selectedStore.toggle(entry.path);
			return;
		}
		coreAPI.selectedStore.clear();
		await props.onclick?.(e);
	}
</script>

<Context.Root bind:open>
	<Context.Trigger data-testid={`file-tree-entry-${entry.name}`}>
		<button
			data-active={coreAPI.isActiveTab(entry.path)}
			data-inSelection={coreAPI.selectedStore.isSelected(entry.path)}
			class={[
				'flex gap-2 items-center p-2 md:py-0 text-sm cursor-pointer group relative text-gray-200',
				'rounded-sm hover:bg-gray-600 hover:border-green-500',
				'transition-all duration-150 w-full',
				'data-[active=true]:bg-green-400/10',
				'focus:outline-none focus:bg-green-400/20 data-[active=true]:focus:bg-green-400/30',
				'data-[inSelection=true]:bg-green-500/10',
				className
			]}
			{...props}
			onclick={handleClick}
		>
			{@render icon?.()}
			{#if renaming}
				<input
					data-testid="rename-entry-input"
					{@attach (node: HTMLElement) => {
						tick().then(() => {
							node.focus();
							//@ts-expect-error select
							node.select();
						});
					}}
					{@attach handleClickOutside}
					bind:value={newName}
					type="text"
					class="text-gray-200 focus:outline-none w-full"
					onkeydown={async (e: KeyboardEvent) => {
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
		</button>
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
