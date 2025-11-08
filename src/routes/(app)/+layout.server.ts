import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	if (locals.session && locals.user) {
		return {
			user: locals.user
		};
	}
	// If no user, redirect to login
	throw redirect(303, '/login');
};