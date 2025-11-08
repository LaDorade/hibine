import { rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { env, loadEnvFile } from 'node:process';

export const clearDatabase = async () => {
	loadEnvFile('.env.test');

	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}
	try {
		await rm(dirname(env.DATABASE_URL), {recursive: true});
	} catch {
		// ignore
	} finally {
		console.log('Database cleared');
	}
};