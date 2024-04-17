import { drawError } from '../svgDrawer/drawError.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';
import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';

export function parseError(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Error') {
    throw new GrammarError('InvalidParser', 'Error parser requires Error Node');
  }

  return {
    ...node,
    drawUnit: drawError(node.content.fragment, node.content.description),
  };
}
