<script lang="ts">
	import { resolve } from '$app/paths';
	import { createTape, getExistingTapes } from '$lib/remotes/tapes.remote';
	import { Disc3, Plus } from '@lucide/svelte';
	import Card from './Card.svelte';
	import { clickOutside } from '$lib/attachments/clickOutside';

	let newTapeName: string = $state('');
	let creatingTape: boolean = $state(false);

	function onClickOutside(node: HTMLElement) {
		clickOutside(node, () => {
			creatingTape = false;
			newTapeName = '';
		});
	}
</script>

<div class="flex flex-col gap-2 w-full h-full overflow-auto">
	<svelte:boundary>
		{#snippet pending()}
			<Card type="none" class="w-60 flex justify-center items-center">
				<i class="animate-spin spin-in">
					<Disc3 class="w-12 h-12 text-gray-200"></Disc3>
				</i>
			</Card>
		{/snippet}
		{#snippet failed(err: Error, reset: () => void)}
			{@const error = err as Error}
			<Card type="button" onclick={reset} class="w-60 flex flex-col gap-4 justify-center items-center bg-red-800/30 rounded hover:bg-red-700/40 cursor-pointer">
				<span>
					{error?.message || 'Unknown Error'}
				</span>
				<span>
					Retry
				</span>
			</Card>
		{/snippet}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-2 w-full">
			<Card
				type="button"
				onclick={() => (creatingTape = true)}
				{@attach onClickOutside}
				class={[
					'cursor-pointer group bg-gray-800/50 hover:bg-gray-800 border-2 border-dashed border-gray-700 flex justify-center items-center',
					creatingTape ? 'bg-gray-800 hover:bg-gray-800' : ''
				]}
			>
				{#if !creatingTape}
					<Plus class="w-12 h-12 text-gray-400 group-hover:text-gray-200" />
				{:else}
					<form {...createTape.enhance(async (all) => {
						if (!newTapeName.trim()) {
							return;
						}
						await all.submit();
						creatingTape = false;
						newTapeName = '';
					})} class="flex flex-col gap-2 justify-center items-center p-2">
						<input
							{...createTape.fields.tapeName.as('text')}
							{@attach (node: HTMLInputElement) => node.focus()}
							placeholder="Enter tape name"
							bind:value={newTapeName}
							class="p-2 w-full bg-gray-800 focus:outline-none rounded border-b"
						/>
						<label class="">
							<button type="submit" class="cursor-pointer hover:bg-gray-700 flex gap-2 justify-center items-center rounded-xl shadow-lg border px-2 py-1">
								Add
								<Plus class="w-4 h-4 text-gray-400" />
							</button>
						</label>
					</form>
				{/if}
			</Card>
			{#each await getExistingTapes() as tape (tape)}
				<Card href={resolve(`/tape/${tape}`)} class=" hover:bg-gray-700 flex justify-center items-center">
					{tape}
				</Card>
			{/each}
		</div>
	</svelte:boundary>
</div>
