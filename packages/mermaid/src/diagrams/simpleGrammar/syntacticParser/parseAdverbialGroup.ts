import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { horizontalMerge } from '../svgDrawer/utils.js';

export function parseAdverbialGroup(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'AdverbialGroup') {
    throw new GrammarError('InvalidParser', 'AdverbialGroup parser requires AdverbialGroup Node');
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'AdverbialGroup has no children');
  }

  return {
    ...node,
    drawUnit: horizontalMerge(
      [...node.children.map((child) => (child as GraphicalNode).drawUnit).reverse()],
      { align: 'start' }
    ),
  };
}
