<script lang="ts">
  import SearchBar from '$components/SearchBar.svelte';
  import Pane from './Pane.svelte';
  import BottomNav from './BottomNav.svelte';
  import { viewportStore } from '$stores/Viewport.svelte.js';
  import { getCurrentTape } from '$lib/remotes/files.remote';
  import { stopEvent } from '$lib/utils';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { onDestroy, onMount } from 'svelte';

  let searchBarOpen: boolean = $state(false);


  async function handleKeys(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      stopEvent(e);
      // open the command palette/file selector
      searchBarOpen = !searchBarOpen;
    }
  }

  onMount(async () => {
    await coreAPI.init();
  });
  onDestroy(async () => {
    await coreAPI.clear();
  });
</script>

<svelte:window onkeydown={handleKeys} onpopstate={async () => {
  await coreAPI.pageStore.openFromUrl();
}} />

{#if !viewportStore.isMobile}
  <SearchBar bind:searchBarOpen />
{/if}

<svelte:head>
  <title>{await getCurrentTape()} – Hibine</title>
</svelte:head>

<main
  aria-label="Main content"
  class="w-full h-full overflow-auto grid grid-rows-[1fr_auto]"
>
  <Pane />
  <!-- Mobile only -->
  <BottomNav />
</main>
