<script lang="ts">
    import type { Snippet } from 'svelte';
    import FileTreeComp from './FileTree/FileTreeComp.svelte';

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
	'overflow-auto overscroll-none flex flex-col justify-between',
	'm-2',
	'bg-gray-800',
	'border-4 border-black',
	'shadow-black shadow-[2px_2px]',
	className ?? '',
]}>
    <div class="h-full">
        {@render header?.()}
        <FileTreeComp />
    </div>
    {@render bottom?.()}
</section>
