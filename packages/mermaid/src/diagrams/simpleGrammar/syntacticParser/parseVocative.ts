import { isFragment, isWord } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawWord } from '../svgDrawer/drawWord.js';

export function parseVocative(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Vocative') {
    throw new Error('Vocative parser requires Vocative Node');
  }

  if (node.children.length !== 1) {
    throw new Error('Invalid Vocative Node: Vocative Node does not have 1 children');
  }

  const child = node.children[0];

  if (child.content && isWord(child.content)) {
    return {
      ...node,
      drawUnit: drawWord(child),
    };
  }

  if (child.content && isFragment(child.content) && child.content.fragment === 'Nominal') {
    return {
      ...node,
      drawUnit: (child as GraphicalNode).drawUnit,
    };
  }

  throw new GrammarError('InvalidStructure', 'Nominal has unexpected structure');
}
