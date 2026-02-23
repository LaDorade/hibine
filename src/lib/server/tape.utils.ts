import { env } from '$env/dynamic/private';
import { access } from 'node:fs/promises';
import path from 'node:path';

const NOTE_DIR = env.NOTE_DIR;

if (!NOTE_DIR) {
  throw new Error('NOTE_DIR environment variable is not set');
}

export async function tapeExists(tapeName: string): Promise<boolean> {
  const tapePath = path.join(NOTE_DIR, tapeName);
  try {
    await access(tapePath);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    } else {
      console.error('Error accessing tape: ', err);
      throw new Error('Failed to access tape');
    }
  }
}