import { isFragment, isWord } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawPreposition } from '../svgDrawer/drawPreposition.js';
import { spaceWord } from '../constants.js';

export function parsePreposition(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Preposition'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Preposition parser requires Preposition Node',
    );
  }

  if (node.children.length > 0) {
    const child = node.children[0];

    if (child.content && isWord(child.content)) {
      return {
        ...node,
        drawUnit: drawPreposition(child),
      };
    } else {
      return {
        ...node,
        drawUnit: (child as GraphicalNode).drawUnit,
      };
    }
  }

  return {
    ...node,
    drawUnit: drawPreposition(spaceWord),
  };
}
