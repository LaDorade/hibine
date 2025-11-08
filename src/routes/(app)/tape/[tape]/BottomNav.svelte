<script lang="ts">
	import SideBar from '$components/SideBar/SideBar.svelte';
	import * as Drawer from '$components/ui/drawer';
	import { viewportStore } from '$stores/Viewport.svelte.js';
	import { FilePlus, FolderTree } from '@lucide/svelte';
</script>

<div class="md:hidden grow w-full h-12 z-10 grid grid-flow-col items-center">
	<button
		class="w-full h-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
				bg-gray-800 border-t border-gray-700"
	>
		<FilePlus strokeWidth={1} />
	</button>
	<Drawer.Root bind:open={viewportStore.isMobileSidebarOpen}>
		<Drawer.Trigger
			class="h-full w-full flex justify-center items-center px-4 text-gray-400 hover:text-white cursor-pointer
					bg-gray-800 border-t border-gray-700"
		>
			<FolderTree strokeWidth={1} />
		</Drawer.Trigger>
		<Drawer.Content class="bg-gray-900 text-gray-200 font-sans p-4">
			<SideBar className="bg-gray-800 rounded" />
		</Drawer.Content>
		<Drawer.Overlay class="fixed inset-0 bg-black/50" />
	</Drawer.Root>
</div>
