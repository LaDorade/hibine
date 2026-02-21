// See https://svelte.dev/docs/kit/types#app.d.ts

import type { validateSessionToken } from '$lib/server/auth';
import type { ClientToServerEvents, ServerClientEvents } from '$types/socket';
import type { Server } from 'socket.io';

// for information about these interfaces
declare global {
	var myServerSocket: Server<
		ClientToServerEvents,
		ServerClientEvents,
		object,
		{
			auth: Awaited<ReturnType<typeof validateSessionToken>>
			tape: string;
		}
	> | null;
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session']
		}
		interface PageState {
			oldTabId?: string;
			active?: string;
		}
	} // interface PageData {}
} // interface Platform {}

export { };
