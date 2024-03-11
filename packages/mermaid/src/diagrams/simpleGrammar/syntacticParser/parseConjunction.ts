import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { horizontalMerge } from '../svgDrawer/utils.js';

export function parseConjunction(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Conjunction') {
    throw new Error('Conjunction parser requires Conjunction Node');
  }

  return {
    ...node,
    drawUnit: horizontalMerge(
      [...node.children.map((child) => (child as GraphicalNode).drawUnit)],
      { align: 'start' }
    ),
  };
}
