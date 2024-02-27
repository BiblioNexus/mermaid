import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawEmpty } from '../svgDrawer/drawEmpty.js';

export function parseRelative(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Relative') {
    throw new GrammarError('InvalidParser', 'Relative parser requires Relative Node');
  }

  if (node.children.length === 0) {
    return {
      ...node,
      drawUnit: drawEmpty(),
    };
  }

  throw new GrammarError('InvalidStructure', 'Nominal has unexpected structure');
}
