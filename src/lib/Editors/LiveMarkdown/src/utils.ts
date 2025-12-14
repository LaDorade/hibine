import type { EditorView } from '@codemirror/view';

export function selectionInNode(view: EditorView, nodeFrom: number, nodeTo: number): boolean {
  // target only the main selection
  // ? maybe extended to cover multiple selections in the future

  const r = view.state.selection.main;
  // selection starts before node and ends inside or after node
  if (r.from <= nodeFrom && r.to >= nodeFrom) return true;
  // selection starts after the end of node and ends after node
  if (r.from <= nodeTo && r.to >= nodeTo) return true;
  // selection is completely inside node
  if (r.from >= nodeFrom && r.to <= nodeTo) return true;
  return false;
}