<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { Info } from '@lucide/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<div class="px-2 hidden md:block">
	<div
		class={[
			'w-full shadow-lg rounded-t-xl h-6 bg-gray-200',
			'justify-end items-center',
			'bg-gray-800 text-xs flex items-center px-4',
			'bg-linear-to-tr from-gray-800 to-green-900 from-90%',
		]}
	>
		<span class="text-gray-600 dark:text-gray-400">
			Status: All changes saved
		</span>
		{#if !coreAPI.pluginRegistry.initialized}
			<span class="ml-4 text-gray-500">
				Initializing plugins
				<span class="animate-pulse">.</span>
				<span class="animate-pulse delay-200">.</span>
				<span class="animate-pulse delay-400">.</span>
			</span>
		{:else}
			{#each coreAPI.ui.statusBarItems.entries() as [id, Comp] (id)}
				<Comp {coreAPI} plugin={coreAPI.pluginRegistry.getPlugin(id)!} />
			{/each}
		{/if}
		<Tooltip.TooltipProvider delayDuration={200}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<span>
						<Info strokeWidth={1.4} class="w-4 h-4 text-gray-200 ml-4" />
					</span>
				</Tooltip.Trigger>
				<Tooltip.Content
					class={['bg-gray-800 text-gray-200']}
					sideOffset={8}
					arrow={false}
				>
					<h4 class="text-sm mb-2">Loaded Plugins</h4>
					<ul class="mt-1 space-y-1 text-xs">
						{#each coreAPI.pluginRegistry.getAllPlugins() as plugin (plugin.id)}
							<li class="flex gap-4 justify-between">
								<span>
									{plugin.name}
								</span>
								<span class="text-gray-500">
									{plugin.kind}
								</span>
							</li>
						{/each}
					</ul>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.TooltipProvider>
	</div>
</div>
