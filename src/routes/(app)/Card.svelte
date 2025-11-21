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
	'flex rounded-lg shadow-lg h-40 bg-gray-800 border border-gray-700 border-b-green-400/20',
	className
]} {...rest}>
	{@render children?.()}
</a>