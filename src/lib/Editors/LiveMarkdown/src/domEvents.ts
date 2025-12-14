import { StateEffect, StateField } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

export const modKeyPressed = StateEffect.define<boolean>();
export const modKeyPressedField = StateField.define<boolean>({
  create() { return false; },
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(modKeyPressed)) {
        return effect.value;
      }
    }
    return value;
  },
});
export const domEventHandlers = EditorView.domEventHandlers({
  keydown: (event, view) => {
    if (event.metaKey || event.ctrlKey) {
      view.dispatch({
        effects: modKeyPressed.of(true),
      });
    }
  },
  keyup: (event, view) => {
    if (!event.metaKey && !event.ctrlKey) {
      view.dispatch({
        effects: modKeyPressed.of(false),
      });
    }
  },
});
