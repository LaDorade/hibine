import { afterEach, describe, expect, it, vi } from 'vitest';
import * as usersRemote from './users.remote';

vi.mock('$app/server');
vi.mock('@sveltejs/kit');
vi.mock('../server/db');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertNewUserMock = vi.spyOn((await import('../server/db/users.utils')), 'insertNewUser').mockResolvedValue({} as any);
const getUserCount = vi.spyOn((await import('../server/db/users.utils')), 'getUserCount');
vi.spyOn((await import('../server/db/roles.utils')), 'createRoleIfNotExists').mockResolvedValue({ id: 1, role: 'admin', description: 'Administrator with full access' });

describe('users.remote', () => {
  const formData = {
    username: 'Admin',
    email: 'admin@example.com',
    _password: 'password'
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create initial user when no users exist', async () => {
    getUserCount.mockResolvedValueOnce(0);

    // Call createInitialUser
    // @ts-expect-error -- Testing the form handler directly
    await usersRemote.createInitialUser(formData);

    // Expect createUser to have been called with correct parameters
    expect(insertNewUserMock).toHaveBeenCalledWith(
      formData.username,
      formData.email,
      formData._password,
      1
    );

    // Expect redirect to have been called to /login
    expect((await import('@sveltejs/kit')).redirect).toHaveBeenCalledWith(303, '/login');
  });

  it('should redirect when users already exist', async () => {
    getUserCount.mockResolvedValueOnce(1);

    // Call createInitialUser
    // @ts-expect-error -- Testing the form handler directly
    await usersRemote.createInitialUser(formData);

    // Expect createUser not to have been called
    expect(insertNewUserMock).not.toHaveBeenCalled();

    // Expect redirect to have been called to /login
    expect((await import('@sveltejs/kit')).redirect).toHaveBeenCalledWith(303, '/login');
  });
});