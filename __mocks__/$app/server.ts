import { vi } from 'vitest';

function createHandler(type: string, schemaOrHandler: unknown, arg2?: unknown) {
	// TODO: Fixme: This is a temporary workaround to mock SvelteKit's form function
	// see: https://github.com/sveltejs/kit/issues/14796
	const handler = (arg2 ?? schemaOrHandler) as { __?: { type: string }};
	handler.__ = {
		type,
	};
	return handler;
}

export const query = (schemaOrHandler: unknown, arg2?: unknown) => {
	return createHandler('query', schemaOrHandler, arg2);
};

export const form = (schemaOrHandler: unknown, arg2?: unknown) => {
	return createHandler('form', schemaOrHandler, arg2);
};

export const command = (schemaOrHandler: unknown, arg2?: unknown) => {
	return createHandler('command', schemaOrHandler, arg2);
};

export const getRequestEvent = vi.fn().mockReturnValue({
	params: {
		tape: 'testing_tape',
	}
});