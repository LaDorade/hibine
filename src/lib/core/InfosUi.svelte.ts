import type { EntryModification } from '$types/modification';
import type { CoreAPI } from './CoreAPI.svelte';

export class InfoUi {
  #maxMessages = 100;
  messageQueue: string[] = $state([]);
  lastMessage: string | null = $derived(this.messageQueue.at(-1) ?? null);

  constructor(private coreAPI: CoreAPI) {}

  addModificationMessage(mod: EntryModification) {
    let message = '';
    switch (mod.type) {
    case 'created':
      message = `Created entry "${mod.newPath}"`;
      break;
    case 'removed':
      message = `Deleted entry "${mod.oldPath}"`;
      break;
    case 'renamed':
      message = `Renamed entry "${mod.oldPath}" to "${mod.newPath}"`;
      break;
    case 'moved':
      message = `Moved entry "${mod.oldPath}" to "${mod.newPath}"`;
      break;
    default:
      message = `Unknown modification on entry "${mod.oldPath}"`;
    }
    this.addMessage(message);
  }

  addMessage(message: string) {
    if (this.messageQueue.length >= this.#maxMessages) {
      this.messageQueue.shift();
    }
    this.messageQueue.push(message);
  }
}