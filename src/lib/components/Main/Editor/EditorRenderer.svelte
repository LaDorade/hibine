<script lang="ts">
  import { coreAPI } from '$core/CoreAPI.svelte';
  import LiveMarkdown from '$lib/Editors/LiveMarkdown/LiveMarkdown.svelte';
  import { settings } from '$stores/Settings.svelte';
  import type { FileEntry } from '$types/files';

  let { file }: { file: FileEntry } = $props();

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

  // ensure file content is synced client-side during HMR
  import.meta.hot?.dispose(async () => {
    if (timeout) clearTimeout(timeout);
    file.content = await coreAPI.files.readFile(file);
  });
</script>

<div class="h-full overflow-hidden">
  <LiveMarkdown {file} {handleContentChange} />
</div>