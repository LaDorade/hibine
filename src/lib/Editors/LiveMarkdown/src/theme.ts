import { EditorView } from '@codemirror/view';

// Base theme for Real-time Markdown styling
export const realtimeMarkdownTheme = EditorView.baseTheme({
  '.rtm-listMark': {
    opacity: '0.5',
    '&.rmt-selected': {
      opacity: '1',
      color: '#9ca3af',
    }
  },
  '.rtm-quoteMark': {
    opacity: '0.5',
  },
  '.rtm-quoteMarkSelected': {
    color: '#9ca3af',
  },
  '.rtm-strongEmphasis': {
    fontWeight: 'bold',
  },
  '.rtm-emphasis': {
    fontStyle: 'italic',
  },
  '.rtm-link': {
    // green-400
    color: '#4ade80',
  },
  '.rtm-url': {
    // green-300
    color: '#86efac',
  },
  '.rtm-heading_1': {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    lineHeight: '2.5rem',
  },
  '.rtm-heading_2': {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    lineHeight: '2.25rem',
  },
  '.rtm-heading_3': {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    lineHeight: '2rem',
  },
  '.rtm-heading_4': {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    lineHeight: '1.75rem',
  },
  '.rtm-heading_5': {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    lineHeight: '1.75rem',
  },
  '.rtm-heading_6': {
    fontWeight: 'bold',
  },
  '.rtm-headerMark': {
    color: '#9ca3af',
  },
});