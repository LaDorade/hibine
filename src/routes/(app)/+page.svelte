<script lang="ts">
	import { resolve } from '$app/paths';
	import { createTape, getExistingTapes } from '$lib/remotes/tapes.remote';
	import { logout } from '$lib/remotes/users.remote';

	let { data } = $props();

	let newTapeName: string = $state('');
	let creatingTape: boolean = $state(false);
</script>

<div
	class="h-screen w-screen bg-gray-900 text-gray-200 overflow-auto p-4 px-20
    flex flex-col gap-2"
>
	<nav class="border-b border-gray-800 h-12">
		{#if data.user?.id}
			<a href={resolve('/')} class="text-blue-500 hover:underline">Home</a>
			<form {...logout}>
				<button class="cursor-pointer" {...logout.buttonProps}>
					Sign Out
				</button>
			</form>
		{:else}
			<a href={resolve('/login')} class="text-blue-500 hover:underline">
				Login
			</a>
		{/if}
	</nav>
	<h2 data-testid="HomeHeading" class="text-2xl font-bold mb-4">
		Available Tapes
	</h2>
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
			class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer
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
			class="flex gap-2"
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
</div>
