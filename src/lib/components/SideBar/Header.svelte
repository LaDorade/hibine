<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { CassetteTape } from '@lucide/svelte';

		type Props = {
			class?: string;
		}
		let {
			class: className = ''
		}: Props = $props();

    let { tape } = $derived(page.params);
</script>

<a class={[
	'w-full',
	'flex items-center gap-3 px-3 h-12 text-gray-200', 
	'bg-linear-to-tl from-gray-800 to-green-900 from-90%',
	'border-b border-transparent hover:border-gray-700',
	'transition-all duration-150',
	className
]}
		href={resolve('/')}
>
    <h2 class="">
			<CassetteTape strokeWidth={1.2} class="w-6" />
		</h2>
    <h3 class="text-lg">
        {tape}
    </h3>
</a>
