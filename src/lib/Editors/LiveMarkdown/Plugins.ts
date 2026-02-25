import { EditorView } from 'codemirror';

export const basicTheme = EditorView.theme({
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

export const fixedHeightEditor = EditorView.theme({
  '&': { height: '100%' },
  '.cm-scroller': { overflow: 'auto' },
});
