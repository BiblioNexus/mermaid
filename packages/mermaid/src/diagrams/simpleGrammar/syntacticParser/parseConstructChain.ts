import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { drawConstructChainConnector } from '../svgDrawer/drawConstructChainConnector.js';

export function parseConstructChain(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ConstructChain'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ConstructChain parser requires ConstructChain Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'ConstructChain has invalid length of children',
    );
  }

  return {
    ...node,
    drawUnit: drawConstructChainConnector(node.children as GraphicalNode[]),
  };
}
