import { beforeEach, describe, expect, it, vi } from 'vitest';
import { vol } from 'memfs';
import * as tapesRemote from './tapes.remote';

vi.mock('node:fs/promises');
vi.mock('$app/server');

beforeEach(() => {
	// reset the state of in-memory fs
	vol.reset();
});

describe('tapes.remote', () => {
	it('get Existing tapes', async () => {
		vol.fromJSON(
			{
				'test-data/tape1/file1.txt': 'content1',
				'test-data/tape2/file2.txt': 'content2',
				'test-data/tape3/file3.txt': 'content3',
			},
			''
		);

		const tapes = await tapesRemote.getExistingTapes();
		expect(tapes).toEqual(['tape1', 'tape2', 'tape3']);
	});
});