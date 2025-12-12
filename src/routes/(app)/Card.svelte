<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		children?: Snippet;
		class?: string | string[];
	}
	let {
		children,
		class: className,
		...rest
	}: Props = $props();
</script>

<a class={[
	'flex border-2 border-black shadow-black h-40',
	'shadow-[4px_4px] hover:shadow-none hover:translate-1',
	'duration-100 transition-all',
	'bg-gray-800',
	className
]} {...rest}>
	{@render children?.()}
</a>