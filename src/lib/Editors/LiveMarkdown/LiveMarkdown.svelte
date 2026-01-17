<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { history } from '@codemirror/commands';
  import { viewportStore } from '$stores/Viewport.svelte';
  import { markdown } from '@codemirror/lang-markdown';
  import { lineNumbers, ViewPlugin, type ViewUpdate } from '@codemirror/view';
  import { EditorView } from 'codemirror';
  import { realtimeMarkdown } from './src';
  import { matchBrackets } from './Codemirror/matchBrackets';

  import type { FileEntry } from '$types/files';

  interface Props {
    file: FileEntry;
    handleContentChange: (file: FileEntry) => Promise<void>;
  }
  let { file, handleContentChange }: Props = $props();

  let dom: HTMLElement = $state()!;
  let cm: EditorView | null = null;

  const basicTheme = EditorView.theme({
    '.cm-content': {
      fontFamily:
        'ui-monospace, SFMono-Regular, Consolas, \'Liberation Mono\', Menlo, Courier, monospace',
      fontSize: '16px',
      lineHeight: '1.5',
      caretColor: 'white',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: '#6b7280', // Tailwind's neutral-500
      border: 'none',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-gutterElement': {
      display: 'flex',
      alignItems: 'center',
      width: '2em',
    },
  });

  const fixedHeightEditor = EditorView.theme({
    '&': { height: '100%' },
    '.cm-scroller': { overflow: 'auto' },
  });

  const updateContentPlugin = ViewPlugin.fromClass(
    class {
      update(update: ViewUpdate) {
        if (update.docChanged) {
          handleContentChange({
            ...file,
            content: update.state.doc.toString(),
          });
        }
      }
    },
  );

  onMount(async () => {
    cm = new EditorView({
      parent: dom,
      doc: file.content ?? '',
      extensions: [
        // Theming
        basicTheme,
        fixedHeightEditor,

        // Misc
        lineNumbers(), // TODO: make activable on settings
        matchBrackets(),
        history(),
        EditorView.lineWrapping, // TODO: make settings
        
        // MD related
        markdown(),
        realtimeMarkdown,
        
        // Svelte related
        updateContentPlugin,
      ],
    });

    await tick();
    autofocus();
  });

  onDestroy(() => {
    cm?.destroy();
    cm = null;
  });

  function autofocus() {
    if (!viewportStore.isMobile && coreAPI.activeTab?.id === file.path) {
      cm?.focus();
    }
  }
</script>

<div
  bind:this={dom}
	{@attach autofocus}
  class="p-4 h-full overflow-auto"
  placeholder="Start writing markdown..."
></div>
