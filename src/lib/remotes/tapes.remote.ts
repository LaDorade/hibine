import { mkdir, readdir, rm } from 'node:fs/promises';
import { form, query } from '$app/server';
import z from 'zod';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const NOTE_DIR = env.NOTE_DIR;

if (!NOTE_DIR) {
  throw new Error('NOTE_DIR environment variable is not set');
}

export const getExistingTapes = query(async () => {
  const entries = await readdir(NOTE_DIR, { withFileTypes: true });
  return entries.filter(entry => entry.isDirectory()).map(dir => dir.name);
});

export const createTape = form(
  z.object({
    tapeName: z.string().min(1).max(100)
  }),
  async ({ tapeName }, invalid) => {
    const tapePath = path.join(NOTE_DIR, tapeName);
		
    try {
      await mkdir(tapePath);
      console.log('Creating tape: ', tapeName);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
        return invalid({message: 'Tape with this name already exists'});
      } else {
        // Invalid server state -> sveltekit error
        console.error('Error creating tape: ', err);
        throw error(500, 'Failed to create tape');
      }
    }

    await getExistingTapes().refresh();
    return { success: true };
  }
);

export const removeTape = form(
  z.object({
    tapeName: z.string().min(1).max(100)
  }),
  async ({ tapeName }) => {
    const tapePath = path.join(NOTE_DIR, tapeName);
    try {
      await rm(tapePath, { recursive: true, force: true });
      console.log('Removing tape: ', tapeName);
    } catch (err) {
      // Invalid server state -> sveltekit error
      console.error('Error removing tape: ', err);
      throw error(500, 'Failed to remove tape');
    }

    await getExistingTapes().refresh();
    return { success: true };
  }
);

