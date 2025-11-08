import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: integer('role').notNull().references(() => role.id)
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const role = sqliteTable('role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	role: text('role').notNull(),
	description: text('description')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Role = typeof role.$inferSelect;
