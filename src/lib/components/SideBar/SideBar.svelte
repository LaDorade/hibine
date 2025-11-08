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

<span class={[
	'overflow-auto overscroll-none flex flex-col justify-between',
	'shadow-lg m-2 rounded-xl',
	className ?? '',
]}>
    <div class="h-full">
        {@render header?.()}
        <FileTreeComp />
    </div>
    {@render bottom?.()}
</span>
