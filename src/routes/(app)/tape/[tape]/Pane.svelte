<script lang="ts">
	import Breadcrumb from '$components/Breadcrumb.svelte';
	import Tabs from '$components/Main/Tabs/Tabs.svelte';
	import View from '$components/Main/Panel.svelte';
	import Bottom from '$components/SideBar/Bottom.svelte';
	import Header from '$components/SideBar/Header.svelte';
	import SideBar from '$components/SideBar/SideBar.svelte';
	import * as Resizable from '$components/ui/resizable';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { ArrowLeftToLine, ArrowRightFromLine } from '@lucide/svelte';

	let paneSize: number = $state(25);
	let isCollapsed: boolean = $derived(paneSize <= 0);

	let sidebarPane: ReturnType<typeof Resizable.Pane>;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			if (isCollapsed) {
				sidebarPane.expand();
			} else {
				sidebarPane.collapse();
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<Resizable.PaneGroup class="hidden md:block h-full" direction="horizontal">
	{#if isCollapsed}
		<div
			class="w-fit p-2 h-full flex flex-col group"
			ondblclick={() => sidebarPane.expand()}
			role="none"
		>
			<Tooltip.TooltipProvider delayDuration={200}>
				<Tooltip.Root>
					<Tooltip.Trigger
						role="button"
						type="button"
						aria-label="Expand Sidebar"
						class="p-3 flex items-center justify-center
				bg-gray-800 rounded-lg shadow-lg cursor-pointer
				hover:bg-gray-700 transition-opacity
				opacity-50 group-hover:opacity-100"
						onclick={() => sidebarPane.expand()}
					>
						<span class="w-6">
							<ArrowRightFromLine strokeWidth={1.2} />
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content
						class={['bg-gray-800 text-gray-200']}
						sideOffset={8}
						arrow={false}
					>
						Expand Sidebar (⌘B)
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.TooltipProvider>
		</div>
	{/if}
	<Resizable.Pane
		bind:this={sidebarPane}
		hidden={isCollapsed}
		aria-hidden={isCollapsed}
		collapsible={true}
		collapsedSize={0}
		class="hidden md:block"
		minSize={20}
		maxSize={50}
		onResize={(size) => {
			paneSize = size;
		}}
	>
		<div class="hidden md:flex md:flex-col h-full">
			<!-- Desktop Only-->
			<SideBar className="h-full bg-gray-800">
				{#snippet header()}
					<div class="flex justify-between h-12">
						<Header />
						<Tooltip.TooltipProvider delayDuration={200}>
							<Tooltip.Root>
								<Tooltip.Trigger
									role="button"
									type="button"
									aria-label="Collapse Sidebar"
									class="h-full text-sm text-white px-4
						hover:bg-gray-700 transition-opacity cursor-pointer border-b border-gray-600"
									onclick={() => sidebarPane.collapse()}
								>
									<span class="w-4 h-4">
										<ArrowLeftToLine strokeWidth={1.2} />
									</span>
								</Tooltip.Trigger>
								<Tooltip.Content
									class={['bg-gray-800 text-gray-200']}
									sideOffset={8}
									arrow={false}
								>
									Collapse Sidebar (⌘B)
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.TooltipProvider>
					</div>
				{/snippet}
				{#snippet bottom()}
					<Bottom />
				{/snippet}
			</SideBar>
		</div>
	</Resizable.Pane>
	<Resizable.Handle class="hidden md:block duration-150 opacity-0 active:opacity-100 hover:opacity-100 focus:opacity-100" />
	<Resizable.Pane class="h-full" defaultSize={75} minSize={50}>
		<div class="w-full h-full grid grid-rows-[auto_auto_1fr]">
			<Tabs />
			<Breadcrumb />
			<View />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
