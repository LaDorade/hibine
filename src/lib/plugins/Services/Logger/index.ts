import { definePlugin } from '$plugins/define';
import LoggerSideBar from './LoggerSideBar.svelte';
import LoggerView from './LoggerView.svelte';


export default definePlugin({
	id: 'logger-service',
	kind: 'service',
	name: 'Logger Service',
	async init({coreAPI}) {
		coreAPI.ui.registerViewComponent('logger-service', LoggerView);
		coreAPI.ui.registerSideBarComponent('logger-service', LoggerSideBar);
	},
	hooks: {
		async onFileOpen(file) {
			console.log(`File opened: ${file.name}`);
		},
		async onFileSave(file) {
			console.log(`File saved: ${file.name}`);
		}
	}
});