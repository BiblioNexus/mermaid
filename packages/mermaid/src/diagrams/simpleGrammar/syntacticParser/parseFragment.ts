import { isFragment, isGraphicalNode } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { verticalMerge } from '../svgDrawer/utils.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawContainer } from '../svgDrawer/drawContainer.js';
import { settings } from '../settings.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { getKeyFromNode, verbparticipleKey } from './keys.js';
import { drawWord } from '../svgDrawer/drawWord.js';

export function parseFragment(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Fragment'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Fragment parser requires Fragment Node',
    );
  }

  if (isGraphicalNode(node.children[0])) {
    if (isFragment(node.children[0].content!)) {
      const drawUnit = node.children[0].drawUnit;

      switch (node.children[0].content.fragment) {
        case 'PrepositionalPhrase': {
          node.children[0].drawUnit = verticalMerge(
            [drawEmptyWord(), drawEmptyLine(70), drawUnit],
            {
              align: 'end',
            },
          );
          break;
        }
        case 'Adjectival': {
          node.children[0].drawUnit = verticalMerge(
            [
              drawEmptyWord(),
              drawEmptyLine(drawUnit.horizontalEnd - drawUnit.horizontalStart),
              drawUnit,
            ],
            {
              align: 'end',
            },
          );
          break;
        }
        case 'Adverbial': {
          node.children[0].drawUnit = verticalMerge(
            [
              drawEmptyLine(drawUnit.horizontalEnd - drawUnit.horizontalStart),
              drawUnit,
            ],
            {
              align: 'end',
            },
          );
          break;
        }
        default: {
          break;
        }
      }
    } else {
      if (getKeyFromNode(node.children[0]) !== verbparticipleKey) {
        return {
          ...node,
          drawUnit: drawWord(node.children[0], true),
        };
      }
    }

    return {
      ...node,
      drawUnit: drawContainer(
        node,
        node.content.description,
        settings.descriptionColor,
        settings.wordStrokeColor,
      ),
    };
  }

  throw new GrammarError('InvalidStructure', 'Fragment has invalid structure');
}
