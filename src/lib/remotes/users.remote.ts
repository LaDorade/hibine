import z from 'zod';
import { redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { checkEmailExists, checkUsernameExists, getUserByUsernameAndPass, getUserCount, insertNewUser } from '$lib/server/db/users.utils';
import { createRoleIfNotExists } from '$lib/server/db/roles.utils';
import * as auth from '$lib/server/auth';

export const registerUser = form(z.object({
	username: z.string(),
	email: z.string(),
	password: z.string()
}), async ({ username, email, password }, invalid) => {

	try {
		// checks
		const [usernameTaken, emailTaken] = await Promise.all([
			checkUsernameExists(username),
			checkEmailExists(email)
		]);
		if (usernameTaken) {
			return invalid.username('Username already taken');
		}
		if (emailTaken) {
			return invalid.email('Email already taken');
		}

		// create role
		const userRole = await createRoleIfNotExists('user', 'Regular user');

		// insert new user
		const user = await insertNewUser(username, email, password, userRole.id);
		if (!user) {
			return invalid('Failed to create user');
		}

		// auto-login/create session
		const event = getRequestEvent();
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (e) {
		console.error(e);
		return invalid('An error has occurred');
	}
	return redirect(302, '/');
});

export const login = form(z.object({
	username: z.string(),
	_password: z.string()
}), async ({ username, _password: password }, invalid) => {

	// check credentials
	const user = await getUserByUsernameAndPass(username, password);
	if (!user) {
		return invalid('Incorrect username or password');
	}

	// login/create session
	const event = getRequestEvent();
	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, user.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return redirect(302, '/');
});

export const createInitialUser = form(z.object({
	username: z.string(),
	email: z.string(),
	_password: z.string()
}), async ({ username, email, _password: password }) => {

	// 1. Check that we are in initial setup state
	// - If no users exist in the database
	if (await getUserCount() <= 0) {
		// 2. Ensure 'admin' role exists
		const adminRole = await createRoleIfNotExists('admin', 'Administrator with full access');

		// 3. Create the initial user
		// -> This will be then called once to create the first admin user
		await insertNewUser(username, email, password, adminRole.id);
	}
	// 4. Redirect to login page
	return redirect(303, '/login');
});

export const logout = form(async (invalid) => {
	const event = getRequestEvent();
	if (!event.locals.session) {
		return invalid('Not logged in');
	}
	await auth.invalidateSession(event.locals.session.id);
	auth.deleteSessionTokenCookie(event);

	return redirect(302, '/login');
});