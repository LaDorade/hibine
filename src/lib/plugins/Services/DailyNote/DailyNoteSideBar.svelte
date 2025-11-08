<script lang="ts">
	import type { SideBarComponentProps } from '$core/internal/UIAPI.svelte';

	let {
		coreAPI
	}: SideBarComponentProps = $props();

	async function handleClick() {
		const name = `${new Date().toISOString().split('T')[0]}`;
		await coreAPI.files.createAndOpenFile(`/daily-notes/${name}.md`);
	}
</script>

<button class={[
	'border px-2 py-1 rounded',
	'hover:bg-white/10'
]} onclick={handleClick}>
	Open Daily Note
</button>