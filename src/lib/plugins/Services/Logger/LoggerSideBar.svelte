<script lang="ts">
	import type { SideBarComponentProps } from '$core/internal/UIAPI.svelte';

	let {
		plugin,
		coreAPI
	}: SideBarComponentProps = $props();

	async function handleClick() {
		await coreAPI.openPluginView(plugin.id, 'Snoup c\'est la best');
	}

</script>

<button onclick={handleClick}>
	Logger Side Bar
</button>