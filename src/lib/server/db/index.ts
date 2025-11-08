import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

// check env variable


// ensure directory exists
// mkdirSync(dirname(env.DATABASE_URL), { recursive: true });

// // initialize database client (create file if it doesn't exist)
// const client = new Database(env.DATABASE_URL, {
// 	fileMustExist: false,
// });

// export const db = drizzle(client, { schema });

type DbClient = BetterSQLite3Database<typeof schema> & {
    $client: Database.Database;
};

let dbClient: DbClient | null = null;
export function getDbClient(): DbClient {
	if (dbClient) {
		return dbClient;
	}

	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	// ensure directory exists
	console.log('Using database at', env.DATABASE_URL);
	mkdirSync(dirname(env.DATABASE_URL), { recursive: true });

	// initialize database client (create file if it doesn't exist)
	console.log('Initializing database client');
	const client = new Database(env.DATABASE_URL, {
		fileMustExist: false,
	});

	dbClient = drizzle(client, { schema });
	
	// migrate if needed
	console.log('Running migrations');
	migrate(dbClient, { migrationsFolder: './drizzle' });

	return dbClient;
}