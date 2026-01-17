import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';

/**
	* Extension to enable matching brackets and auto-closing brackets in CodeMirror.
	* 
	* Brackets supported: (), [], {}, '', "", ``, *, _
	*/
export const matchBrackets = () => {
  return [
    EditorState.languageData.of(() => [
      {
        closeBrackets: {
          brackets: ['(', '[', '{', '\'', '"', '`', '*', '_'],
        },
      },
    ]),
    keymap.of(closeBracketsKeymap),
    closeBrackets(),
  ];
};