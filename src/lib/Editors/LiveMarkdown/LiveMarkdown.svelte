<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { coreAPI } from '$core/CoreAPI.svelte';
  import { settings } from '$stores/Settings.svelte';
  import { history } from '@codemirror/commands';
  import { viewportStore } from '$stores/Viewport.svelte';
  import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
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

  $effect(() => {
    cm = new EditorView({
      parent: dom,
      doc: file.content ?? '',
      extensions: [
        // Theming
        basicTheme,
        fixedHeightEditor,

        // Misc
        settings.get('lineNumbers') ? lineNumbers() : [],
        matchBrackets(),
        history(),
        settings.get('lineWrap') ? EditorView.lineWrapping : [],
        
        // MD related
        markdown({base: markdownLanguage}),
        realtimeMarkdown,
        
        // Svelte related
        updateContentPlugin,
      ],
    });

    tick().then(() =>{
      autofocus();
    });

    return () => {
      cm?.destroy();
      cm = null;
    };
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
  class="p-4 h-full overflow-auto w-full max-w-4xl justify-self-center"
  placeholder="Start writing markdown..."
></div>
