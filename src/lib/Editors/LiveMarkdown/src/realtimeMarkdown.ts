import { syntaxTree } from '@codemirror/language';
import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet } from '@codemirror/view';

import { selectionInNode } from './utils.js';
import { ClickableLinkWidget } from './Widget/ClickableLink';
import { modKeyPressed, modKeyPressedField } from './domEvents';

import { type Range } from '@codemirror/state';

export function realtimeMarkdown(view: EditorView): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        const isModKeyPressed = view.state.field(modKeyPressedField, false);
        const isInSelection = selectionInNode(view, node.from, node.to);
        switch (node.name) {
        case 'ListMark': {
          decorations.push(
            Decoration.mark({ 
              class: [
                'rtm-listMark',
                isInSelection ? 'rtm-selected' : ''
              ].join(' ')
            }).range(node.from, node.to)
          );
          break;
        }
        case 'ListItem': {
          decorations.push(
            Decoration.mark({ class: 'rtm-listItem' }).range(node.from, node.to)
          );
          break;
        }
        case 'QuoteMark': {
          if (!isInSelection) {
            decorations.push(
              Decoration.mark({ class: 'rtm-quoteMark'}).range(node.from, node.to)
            );
          } else {
            decorations.push(
              Decoration.mark({ class: 'rtm-quoteMarkSelected' }).range(node.from, node.to)
            );
          }
          break;
        }
        case 'Blockquote': {
          break;
        }
        case 'CodeMark': {
          if (!isInSelection) {
            decorations.push(
              Decoration.mark({ class: 'rtm-codeMark' }).range(node.from, node.to)
            );
          } else {
            decorations.push(
              Decoration.mark({ class: 'rtm-codeMark rtm-selected' }).range(node.from, node.to)
            );
          }
          break;
        }
        case 'InlineCode': {
          const markLength = 1;
          if (!isInSelection) {
            decorations.push(
              Decoration.replace({}).range(node.from, node.from + markLength),
              Decoration.replace({}).range(node.to - markLength, node.to),
            );
          }
          decorations.push(
            Decoration.mark({ class: 'rtm-inlineCode' }).range(node.from, node.to)
          );
          break;
        }
        case 'FencedCode': {
          decorations.push(
            Decoration.mark({ class: 'rtm-fencedCode' }).range(node.from, node.to)
          );
          break;
        }
        case 'Paragraph': {
          break;
        }
        case 'HorizontalRule': {
          decorations.push(
            Decoration.mark({ class: 'rtm-horizontalRule' }).range(node.from, node.to)
          );
          break;
        }
        case 'StrongEmphasis':
          if (!isInSelection) {
            decorations.push(
              Decoration.replace({}).range(node.from, node.from + 2),
              Decoration.replace({}).range(node.to - 2, node.to),
            );
          }
          decorations.push(
            Decoration.mark({ class: 'rtm-strongEmphasis' }).range(node.from + 2, node.to - 2)
          );
          break;
        case 'Emphasis':
          if (!isInSelection) {
            decorations.push(
              Decoration.replace({}).range(node.from, node.from + 1),
              Decoration.replace({}).range(node.to - 1, node.to),
            );
          }
          decorations.push(
            Decoration.mark({ class: 'rtm-emphasis' }).range(node.from + 1, node.to - 1)
          );
          break;
        case 'Link':
        case 'LinkMark': {
          const text = view.state.sliceDoc(node.from, node.to);
          const match = text.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            const linkText = match[1];
            const url = match[2];

            if (!isInSelection && url) {
              // Hide the brackets and parentheses
              decorations.push(
                Decoration.replace({
                  widget: new ClickableLinkWidget(url, linkText),
                }).range(node.from, node.to)
              );
            } else {
              // Style le texte du lien
              decorations.push(
                Decoration.mark({ class: 'rtm-link' }).range(node.from, node.to)
              );
            }
          }
          break;
        }
        case 'URL': {
          if (isInSelection || isModKeyPressed) {
            // Afficher l'URL en texte brut quand sélectionné OU quand mod key pressée
            decorations.push(
              Decoration.mark({ class: 'rtm-url' }).range(node.from, node.to)
            );
          } else {
            // Afficher comme lien cliquable autrement
            decorations.push(
              Decoration.replace({
                widget: new ClickableLinkWidget(view.state.sliceDoc(node.from, node.to)),
              }).range(node.from, node.to)
            );
          }
          break;
        }
        case 'ATXHeading1':
        case 'SetextHeading1':
        case 'ATXHeading2':
        case 'SetextHeading2':
        case 'ATXHeading3':
        case 'ATXHeading4':
        case 'ATXHeading5':
        case 'ATXHeading6': {
          const headingLevel = node.name.includes('1') ? 1 :
            node.name.includes('2') ? 2 :
              node.name.includes('3') ? 3 :
                node.name.includes('4') ? 4 :
                  node.name.includes('5') ? 5 : 6;
                        
          const prefixLength = node.name.startsWith('ATX') ? headingLevel + 1 : 2;
          const text = view.state.sliceDoc(node.from, node.to).split(' ')?.[1]; // Texte après les # ou =
                        
          if (!isInSelection && text) {
            decorations.push(
              Decoration.replace({}).range(node.from, node.from + prefixLength),
            );
          } else {
            decorations.push(
              Decoration.mark({ class: 'rtm-headerMark' }).range(node.from, node.from + prefixLength),
            );
          }
          decorations.push(
            Decoration.mark({ 
              class: `rtm-heading_${headingLevel}`
            }).range(node.from, node.to)
          );
          break;
                    
        }
        case 'HeaderMark': {
          break;
        }
        default:
          break;
        }
      },
    });
  }
  return Decoration.set(decorations.sort((a, b) => {
    if (a.from === b.from) {
      return a.value.startSide - b.value.startSide;
    }
    return a.from - b.from;
  }));
}
export const liveMarkdownPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = realtimeMarkdown(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
                update.selectionSet ||
                update.focusChanged
                || update.transactions.some(tr => tr.effects.some(e => e.is(modKeyPressed)))
      )
        this.decorations = realtimeMarkdown(update.view);
    }
  },
  {
    decorations: v => v.decorations,
  },
);
