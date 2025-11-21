<script lang="ts">
	import { logout } from '$lib/remotes/users.remote';
	import { CassetteTape } from '@lucide/svelte';
	import TapeList from './TapeList.svelte';

	let { data } = $props();
</script>

<main class="flex flex-col h-screen">
	<nav class="flex justify-between items-center w-full p-4">
		<div class="flex items-center gap-4">
			<CassetteTape strokeWidth={1} class="w-12 h-12" />
			<span class="text-xl">Hibine.</span>
		</div>
		<div>
			{#if data.user?.id}
				<span class=" text-gray-200">{data.user.username}</span>
				<form {...logout}>
					<button class="cursor-pointer" {...logout.buttonProps}>
						Sign Out
					</button>
				</form>
			{/if}
		</div>
	</nav>
	<div class="flex flex-col h-full w-full px-4 overflow-auto">
		<h1 data-testid="HomeHeading" class="text-2xl font-bold mb-4">
			Available Tapes
		</h1>
		<TapeList />
	</div>
	<footer class="flex items-center h-fit p-2 px-4 text-gray-200 bg-gray-800 shadow-2xl rounded-t-xl mx-4">
		Hibine.
	</footer>
</main>
