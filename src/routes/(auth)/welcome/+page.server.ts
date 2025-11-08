import { redirect, type ServerLoad } from '@sveltejs/kit';
import { getUserCount } from '$lib/server/db/users.utils';

export const load: ServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	// If any users exist, redirect to the login page
	if (await getUserCount() > 0) {
		return redirect(303, '/login');
	}
	return {};
};