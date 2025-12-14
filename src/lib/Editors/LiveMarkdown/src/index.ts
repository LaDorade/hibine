import { liveMarkdownPlugin } from './realtimeMarkdown.js';
import { domEventHandlers } from './domEvents.js';
import { realtimeMarkdownTheme } from './theme.js';
import type { Extension } from '@codemirror/state';

export * from './realtimeMarkdown.js';
export * from './domEvents.js';
export * from './theme.js';

export const realtimeMarkdown: Extension[] = [
  liveMarkdownPlugin,
  domEventHandlers,
  realtimeMarkdownTheme,
];

export const realtimeMarkdownWithoutTheme: Extension[] = [
  liveMarkdownPlugin,
  domEventHandlers,
];