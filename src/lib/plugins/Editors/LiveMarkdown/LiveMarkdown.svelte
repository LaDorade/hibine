<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { viewportStore } from '$stores/Viewport.svelte';
	import type { EditorPluginProps } from '$core/types';

	let { 
		file = $bindable(), 
		handleContentChange
	}: EditorPluginProps = $props();

	function autofocus(node: HTMLElement) {
		if (!viewportStore.isMobile && coreAPI.activeTab?.id === file.path) {
			node.focus();
		}
	}
</script>

<textarea
	bind:value={file.content}
	{@attach autofocus}
	oninput={(e) => handleContentChange(e, file)}
	class="w-full h-full p-6 font-mono text-base leading-relaxed bg-gray-900
			focus:outline-none focus:ring-0
			resize-none text-gray-200 placeholder-gray-500 shadow-sm
			markdown-editor"
	placeholder="Start writing markdown..."
></textarea>

