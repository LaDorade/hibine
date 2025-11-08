class DragStore {
	draggedItem: unknown | null = $state(null);

	drag(item: unknown) {
		this.draggedItem = $state.snapshot(item);
	}

	drop(): unknown {
		return $state.snapshot(this.draggedItem);
	}
}

export const dragStore = new DragStore();