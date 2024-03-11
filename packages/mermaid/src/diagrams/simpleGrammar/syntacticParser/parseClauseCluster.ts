import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

export function parseClauseCluster(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ClauseCluster'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ClauseCluster parser requires ClauseCluster Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'ClauseCluster has no children');
  }

  return {
    ...node,
    drawUnit: (node.children[0] as GraphicalNode).drawUnit,
  };
}
