<script lang="ts">
  import { coreAPI } from '$core/CoreAPI.svelte';
  import LiveMarkdown from '$lib/Editors/LiveMarkdown/LiveMarkdown.svelte';
  import { settings } from '$stores/Settings.svelte';
  import type { FileEntry } from '$types/files';
  import type { TabFileEntry } from '$types/tabs';

  let { tab }: { tab: TabFileEntry } = $props();

  // Debounce the writeToFile calls
  let timeout: NodeJS.Timeout | null = null;
  async function handleContentChange(file: FileEntry) {
    settings.saveSet.saving = true;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        if (file.content !== null) {
          await coreAPI.write(tab, file.content);
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
    tab.file = {
      ...tab.file,
      ...await coreAPI.files.readFile(tab.file)
    };
  });
</script>

<div class="h-full overflow-hidden">
  <LiveMarkdown file={tab.file} {handleContentChange} />
</div>