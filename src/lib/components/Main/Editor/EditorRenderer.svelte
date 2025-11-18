<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { proxiedSettings } from '$stores/Settings.svelte';
	import { liveMarkdown } from '$lib/Editors';
	import type { FileEntry } from '$types/files';

	let { entry = $bindable() }: { entry: FileEntry } = $props();

	let _saving = $state(false);
	let _saveError: string | null = $state(null);

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
	const MdEditor = liveMarkdown.component;
</script>

<div class="relative w-full h-full">
	<MdEditor file={entry} {handleContentChange} />
</div>
