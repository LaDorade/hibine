import { redirect, type ServerLoad } from '@sveltejs/kit';
import { getUserCount } from '$lib/server/db/users.utils';


export const load: ServerLoad = async (event) => {
  // If user is already logged in, redirect to home
  if (event.locals.user) {
    return redirect(302, '/');
  }
  // If no users exist, redirect to the welcome/setup page
  if (await getUserCount() <= 0) {
    return redirect(303, '/welcome');
  }
  return {};
};