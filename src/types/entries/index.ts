import type { CreatedModification } from '$types/modification';
import type { Result } from '$types/utils';

export type CommonError = 'tape-not-found';

/* * Create Entry */
export type CreateEntryError = CommonError | 'invalid-name' | 'already-exists' | 'creation-failed';
export type SocketCreateEntryError = CreateEntryError | 'invalid-params';
export type CreateEntryResult = Result<CreatedModification, CreateEntryError>;
