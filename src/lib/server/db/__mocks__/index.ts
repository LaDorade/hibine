import { vi } from 'vitest';

const dbObj = {
	select: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	update: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	then: vi.fn().mockResolvedValue([]),
};

export const db = dbObj;
