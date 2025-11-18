<script lang="ts">
    import { settings } from '$stores/Settings.svelte';
</script>

<div class="px-2 hidden md:block">
	<div
		class={[
			'w-full shadow-lg rounded-t-xl h-6 bg-gray-200',
			'justify-end items-center',
			'bg-gray-800 text-xs flex items-center px-4',
		]}
	>
		{#if settings.saveSet.saving}
			<span class="text-gray-500">
				Saving...
			</span>
		{:else}
			<span class="text-gray-400">
				Status: All changes saved
			</span>
		{/if}
	</div>
</div>
