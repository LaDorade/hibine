import { definePlugin } from '$plugins/define';
import DailyNoteSideBar from './DailyNoteSideBar.svelte';

export default definePlugin({
	id: 'daily-note-service',
	name: 'Daily Note Service',
	kind: 'service',
	async init({ coreAPI }) {
		coreAPI.ui.registerSideBarComponent('daily-note-service', DailyNoteSideBar);
	}
});