<script lang="ts">
	import { logout } from '$lib/remotes/users.remote';
    import { CassetteTape } from '@lucide/svelte';
	import TapeList from './TapeList.svelte';

	let { data } = $props();

</script>

<div class="flex flex-col md:grid md:grid-cols-12 items-center h-screen w-full">
	<nav class="flex md:hidden justify-center items-center h-fit w-full p-4">
		<CassetteTape strokeWidth={1} class="w-12 h-12" />
			<h1 class="text-xl">
				Hibine.
			</h1>
	</nav>
	<div
		class="md:col-span-8 w-full px-4 md:h-full md:py-20 bg-gray-900 text-gray-200 overflow-auto md:px-20
    flex flex-col gap-2"
	>
		<nav class="border-b border-gray-800 h-12 flex gap-4 items-center justify-between">
			{#if data.user?.id}
				<span class=" text-gray-200">{data.user.username}</span>
				<form {...logout}>
					<button class="cursor-pointer" {...logout.buttonProps}>
						Sign Out
					</button>
				</form>
			{/if}
		</nav>
		<h2 data-testid="HomeHeading" class="text-2xl font-bold mb-4">
			Available Tapes
		</h2>
		<TapeList />
	</div>
	<div class="hidden col-span-4 md:flex flex-col items-center
		 bg-radial from-green-500/20 to-transparent to-50%
		rounded-full aspect-square">
		<div class="flex flex-col justify-center items-center h-full">
			<CassetteTape strokeWidth={1} class="w-40 h-40" />
			<h1 class="text-xl">
				Hibine.
			</h1>
		</div>
	</div>
</div>
