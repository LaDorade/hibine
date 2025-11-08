import Editor from './LiveMarkdown.svelte';
import { definePlugin } from '$plugins/define';

export default definePlugin({
	id: 'markdown-editor',
	name: 'Markdown Editor',
	kind: 'editor',
	editor: {
		fileExtensions: ['*', '.md', '.markdown'],
		editor: Editor
	},
});