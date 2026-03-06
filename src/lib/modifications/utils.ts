import type { EntryModification } from '$types/modification';

export function formatModificationMessage(mod: EntryModification) {
  const oldPath = mod.oldPath || '<created>';
  const newPath = mod.newPath || '<deleted>';

  return `${oldPath} → ${newPath}`;
}

export function formatModificationsMessage(mods: EntryModification[]) {
  if (mods.length === 0) return 'No modifications';
  if (mods.length === 1) return formatModificationMessage(mods[0]);
  return `${mods.length} modifications: ${formatModificationMessage(mods[0])} ...`;
}