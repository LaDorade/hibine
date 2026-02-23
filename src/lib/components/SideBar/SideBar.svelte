<script lang="ts">
  import FileTreeComp from './FileTree/FileTreeComp.svelte';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { WifiOff } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    header?: Snippet;
    bottom?: Snippet;
    className?: string;
  };
  let {
    header,
    bottom,
    className
  }: Props = $props();
</script>

<section class={[
  'relative',
  'overflow-auto overscroll-none flex flex-col justify-between',
  'm-2',
  'bg-gray-800',
  'border-4 border-black',
  'shadow-black shadow-[2px_2px]',
  className ?? '',
]}>
  {#if !coreAPI.clientSocket?.connected}
    <div class="absolute w-full h-full bg-black/50 z-10 flex justify-center items-center">
      <WifiOff class="w-8 h-8" />
    </div>
  {/if}
  <div class="h-full">
    {@render header?.()}
    <FileTreeComp />
  </div>
  {@render bottom?.()}
</section>
