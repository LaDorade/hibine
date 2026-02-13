import { beforeEach, describe, expect, it, vi } from 'vitest';
import { vol } from 'memfs';
import { getCurrentTape, getFileContent, getFileTree } from './files.remote';
import { getRequestEvent } from '../../../__mocks__/$app/server';
import * as kit from '@sveltejs/kit';
import * as lib from '$lib';

describe('files.remote', () => {
  beforeEach(() => {
    vi.mock('$lib');
    vi.clearAllMocks();
  });
  describe('getFileTree', () => {
    it('should throw an error if tape is not found', async () => {
      vi.mock('$app/server');
      vi.mock('../../server/consts');
      vi.spyOn(kit, 'error');
      getRequestEvent.mockReturnValueOnce({
        params: {
          tape: 'non_existent_tape'
        }
      });
      await getFileTree().catch((err) => {
        expect(err.body.message).toBe('Tape not found');
        expect(kit.error).toHaveBeenCalledWith(404, 'Tape not found');
      });
    });

    it('should throw an error if tape parameter is not set', async () => {
      vi.mock('$app/server');
      vi.mock('@sveltejs/kit', { spy: true });
      vi.spyOn(kit, 'error');
      getRequestEvent.mockReturnValueOnce({
        params: {}
      });
      await getFileTree().catch((err) => {
        expect(err.body.message).toBe('Tape parameter is missing');
        expect(kit.error).toHaveBeenCalledWith(400, 'Tape parameter is missing');
      });
    });

    it('should return a file tree for a valid tape', async () => {
      vi.mock('$app/server');
      vi.mock('../../server/consts');
      vi.spyOn(lib, 'createFileTree').mockResolvedValue([{
        name: 'file1.txt',
        content: null,
        childs: null,
        type: 'file',
        path: 'file1.txt',
        lastKnownTimestamp: Date.now(),
      }]);
      const tree = await getFileTree();
      expect(tree).toBeDefined();
    });
  });

  describe('getCurrentTape', () => {
    it('should return the current tape', async () => {
      vi.mock('$app/server');
      const tape = await getCurrentTape();
      expect(tape).toBe('testing_tape');
    });
    it('should throw an error if tape parameter is not set', async () => {
      vi.mock('$app/server');
      vi.mock('@sveltejs/kit', { spy: true });
      vi.spyOn(kit, 'error');
      getRequestEvent.mockReturnValueOnce({
        params: {}
      });
      await getCurrentTape().catch((err) => {
        expect(err.body.message).toBe('Tape parameter is missing');
        expect(kit.error).toHaveBeenCalledWith(400, 'Tape parameter is missing');
      });
    });
  });

  describe('getFileContent', () => {
    beforeEach(() => {
      vi.mock('$app/server');
      vi.mock('node:fs');
      vi.mock('node:fs/promises');
      vol.reset();
    });
    it('should return the content of a file', async () => {
      vol.fromJSON({
        'test-data/testing_tape/file.txt': 'file content',
      });
      const content = await getFileContent('file.txt');
      expect(content.content).toBe('file content');
    });
    it('should throw an error if file does not exist', async () => {
      vol.fromJSON({});
      await getFileContent('non_existent_file.txt').catch((err) => {
        expect(err.code).toBe('ENOENT');
      });
    });
  });
});