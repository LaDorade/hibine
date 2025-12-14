import { SvelteSet } from 'svelte/reactivity';

export class SelectedStore {
  private selected: Set<string> = new SvelteSet<string>();

  select(path: string) {
    this.selected.add(path);
  }

  deselect(path: string) {
    this.selected.delete(path);
  }

  toggle(path: string) {
    if (this.selected.has(path)) {
      this.selected.delete(path);
    } else {
      this.selected.add(path);
    }
  }

  isSelected(path: string): boolean {
    return this.selected.has(path);
  }

  /**
	 * TODO 
	 * Select or de-select files until the target path 
	 */
  rangeTo(_targetPath: string) {
    // TODO: check if the path is alredy selected 
    // TODO: get all files sorted by the users methods
    // TODO: toggle files between the last selected and the targetPath
  }

  clear() {
    this.selected.clear();
  }

  getAll(): string[] {
    return Array.from(this.selected);
  }
}