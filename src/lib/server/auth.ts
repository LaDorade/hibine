import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { getDbClient } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { dev } from '$app/environment';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);
  return token;
}

export async function createSession(token: string, userId: number) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: table.Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
  };
  await getDbClient().insert(table.session).values(session);
  return session;
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await getDbClient()
    .select({
      // Adjust user table here to tweak returned data
      user: { id: table.user.id, username: table.user.username, email: table.user.email, role: table.user.role },
      role: table.role,
      session: table.session
    })
    .from(table.session)
    .innerJoin(table.role, eq(table.user.role, table.role.id))
    .innerJoin(table.user, eq(table.session.userId, table.user.id))
    .where(eq(table.session.id, sessionId));

  if (!result) {
    return { session: null, user: null, role: null };
  }
  const { session, user, role } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await getDbClient().delete(table.session).where(eq(table.session.id, session.id));
    return { session: null, user: null, role: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await getDbClient()
      .update(table.session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.session.id, session.id));
  }

  return { session, user, role };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
  await getDbClient().delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  event.cookies.set(sessionCookieName, token, {
    expires: expiresAt,
    path: '/',
    secure: !dev
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(sessionCookieName, {
    path: '/'
  });
}
