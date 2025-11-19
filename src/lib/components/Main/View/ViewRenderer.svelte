<script lang="ts">
	import type { TabViewEntry } from '$core/internal/stores/TabStore.svelte';

	interface Props {
		entry: TabViewEntry
	}
	let {
		entry
	}: Props = $props();

	let Comp = $derived(entry.component);
</script>

<Comp />