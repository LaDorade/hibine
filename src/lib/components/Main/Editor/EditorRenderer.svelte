<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { proxiedSettings } from '$stores/Settings.svelte';
	import type { FileEntry } from '$types/files';

	let { entry = $bindable() }: { entry: FileEntry } = $props();

	let _saving = $state(false);
	let _saveError: string | null = $state(null);

	let plugin = $derived(coreAPI.pluginRegistry.resolveEditorPlugin(entry.path.split('.').pop() || ''));

	// Debounce the writeToFile calls
	let timeout: NodeJS.Timeout | null = null;
	async function handleContentChange(e: Event, file: FileEntry) {
		if (!proxiedSettings.autoSave) return;
		if (file.content === null) return;
		_saving = true;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(async () => {
			try {
				if (file.content === null) return;
				await coreAPI.files.writeFile(file, file.content);
			} catch (error) {
				_saveError = String(error);
				console.error('Error saving file:', error);
			} finally {
				_saving = false;
			}
		}, 500);
	}
</script>

<div class="relative w-full h-full">
	{#if plugin}
		{@const PluginComponent = plugin.editor.editor}
		<PluginComponent {coreAPI} bind:file={entry} {handleContentChange} />
	{:else}
		<div
			class="flex h-full items-center justify-center text-gray-400 font-medium opacity-60 p-4"
		>
			No editor plugin found for this file type
		</div>
	{/if}
</div>
