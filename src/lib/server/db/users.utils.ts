import { getDbClient } from '.';
import { hash, verify } from '@node-rs/argon2';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const argon2Config = {
	// recommended minimum parameters
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
};

export const getUserCount = async (): Promise<number> => {
	const result = await getDbClient()
		.select({id: table.user.id})
		.from(table.user);
	return result.length;
};

export const insertNewUser = async (username: string, email: string, rawPassword: string, roleId: number): Promise<table.User | null> => {
	return (await getDbClient().insert(table.user).values({
		username,
		email,
		passwordHash: await hashPassword(rawPassword),
		role: roleId
	}).returning()).at(0) || null;
};

export const getUserByUsernameAndPass = async (username: string, password: string): Promise<table.User | null> => {
	const result = await getDbClient()
		.select()
		.from(table.user)
		.where(eq(table.user.username, username));
	const user = result.at(0);
	if (!user) {
		return null;
	}

	const isValid = await verifyPassword(user.passwordHash, password);
	return isValid ? user : null;
};

export const checkUsernameExists = async (username: string): Promise<boolean> => {
	const result = await getDbClient()
		.select()
		.from(table.user)
		.where(eq(table.user.username, username));
	return result.length > 0;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
	const result = await getDbClient()
		.select()
		.from(table.user)
		.where(eq(table.user.email, email));
	return result.length > 0;
};

async function hashPassword(password: string): Promise<string> {
	return await hash(password, argon2Config);
}

async function verifyPassword(hashStr: string, password: string): Promise<boolean> {
	return await verify(hashStr, password, argon2Config);
}
