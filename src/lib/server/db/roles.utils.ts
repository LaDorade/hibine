import { getDbClient } from '.';
import type { Role } from './schema';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const createRoleIfNotExists = async (roleName: string, description?: string): Promise<Role> => {
  // normalize
  roleName = roleName.trim().toLowerCase();

  // check existing
  const existingRole = await getDbClient()
    .select()
    .from(table.role)
    .where(eq(table.role.role, roleName))
    .limit(1)
    .then(res => res[0]);

  if (existingRole) {
    return existingRole;
  }

  // create new
  const newRole = await getDbClient()
    .insert(table.role)
    .values({
      role: roleName,
      description: description || null
    })
    .returning()
    .then(res => res[0]);

  return newRole;
};