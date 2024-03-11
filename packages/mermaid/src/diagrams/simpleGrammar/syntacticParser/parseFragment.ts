import { isFragment, isGraphicalNode } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { verticalMerge } from '../svgDrawer/utils.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawContainer } from '../svgDrawer/drawContainer.js';
import { settings } from '../settings.js';

export function parseFragment(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Fragment') {
    throw new GrammarError('InvalidParser', 'Fragment parser requires Fragment Node');
  }

  if (node.children.length !== 1) {
    throw new GrammarError('InvalidStructure', 'Fragment has invalid children');
  }

  if (isGraphicalNode(node.children[0])) {
    if (
      isFragment(node.children[0].content!) &&
      node.children[0].content.fragment === 'PrepositionalPhrase'
    ) {
      node.children[0].drawUnit = verticalMerge([drawEmptyWord(), node.children[0].drawUnit], {
        align: 'end',
      });
    }

    return {
      ...node,
      drawUnit: drawContainer(
        node,
        node.content.description,
        settings.descriptionColor,
        settings.wordStrokeColor
      ),
    };
  }

  throw new GrammarError('InvalidStructure', 'Fragment has invalid structure');
}
