<script lang="ts">
	import { resolve } from '$app/paths';
	import { createTape, getExistingTapes } from '$lib/remotes/tapes.remote';
	import { Disc3 } from '@lucide/svelte';

	let newTapeName: string = $state('');
	let creatingTape: boolean = $state(false);
</script>

<div class="flex flex-col gap-2 w-full h-full overflow-auto">
	<svelte:boundary>
		{#snippet pending()}
			<span class="flex items-center">
				<i class="animate-spin spin-in">
					<Disc3 class="w-12 h-12 text-gray-200"></Disc3>
				</i>
			</span>
		{/snippet}
		{#snippet failed(err, reset)}
			{@const error = err as Error}
			<div class="flex flex-col gap-2">
				<h3 class="text-lg font-bold">
					{error?.message || 'Unknown Error'}
				</h3>
				<button
					onclick={reset}
					class="p-2 w-fit text-left bg-red-800 rounded hover:bg-red-700 cursor-pointer"
				>
					Retry
				</button>
			</div>
		{/snippet}
		{#each await getExistingTapes() as tape (tape)}
			<a
				data-testid="tape-item"
				href={resolve(`/tape/${tape}`)}
				class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
			>
				{tape}
			</a>
		{/each}
		{#if !creatingTape}
			<button
				data-testid="create-tape-button"
				onclick={() => (creatingTape = true)}
				class="sticky bottom-0 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer
            border-dashed border border-gray-600 hover:border-gray-500
            "
			>
				Create New Tape
			</button>
		{:else}
			<form
				{...createTape.enhance(async (all) => {
					if (!newTapeName.trim()) {
						return;
					}
					await all.submit();
					creatingTape = false;
					newTapeName = '';
				})}
				class="flex gap-2 sticky bottom-0"
			>
				<input
					data-testid="tape-name-input"
					{@attach (node) => node.focus()}
					type="text"
					name="tapeName"
					bind:value={newTapeName}
					placeholder="Enter tape name"
					class="p-2 w-full bg-gray-800 focus:outline-none rounded border border-gray-600"
				/>
				<button
					name="submitTapeButton"
					data-testid="submit-tape-button"
					type="submit"
					class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
				>
					Add
				</button>
				<button
					class="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
					type="button"
					onclick={() => {
						creatingTape = false;
						newTapeName = '';
					}}
				>
					Cancel
				</button>
			</form>
		{/if}
	</svelte:boundary>
</div>
