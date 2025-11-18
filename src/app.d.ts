// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
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
