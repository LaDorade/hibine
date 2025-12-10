<script lang="ts">
	import { coreAPI } from '$core/CoreAPI.svelte';
	import { liveMarkdown } from '$lib/Editors';
  import { settings } from '$stores/Settings.svelte';
	import type { FileEntry } from '$types/files';

	let { entry = $bindable() }: { entry: FileEntry } = $props();

	// Debounce the writeToFile calls
	let timeout: NodeJS.Timeout | null = null;
	async function handleContentChange(file: FileEntry) {
		if (!settings.get('autoSave') || file.content === null) {
			return;
		}
		settings.saveSet.saving = true;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(async () => {
			try {
				if (file.content !== null) {
					await coreAPI.files.writeFile(file, file.content);
				}
			} catch (error) {
				console.error('Error saving file:', error);
			} finally {
				settings.saveSet.saving = false;
			}
		}, 500);
	}
	const MdEditor = liveMarkdown.component;
</script>

<div class="h-full overflow-hidden">
	<MdEditor file={entry} {handleContentChange} />
</div>
