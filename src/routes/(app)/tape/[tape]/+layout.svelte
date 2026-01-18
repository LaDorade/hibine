<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import { viewportStore } from '$stores/Viewport.svelte';
  import { onMount } from 'svelte';
  import StatusBar from './StatusBar.svelte';
  import { settings } from '$stores/Settings.svelte';

  let { children } = $props();

  onMount(async () => {
    viewportStore.updateDimensions();
    settings.load();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onresize={() => viewportStore.updateDimensions()} />

<div class="w-full h-svh flex flex-col overflow-hidden overscroll-none">
  {@render children?.()}
  <StatusBar />
</div>
