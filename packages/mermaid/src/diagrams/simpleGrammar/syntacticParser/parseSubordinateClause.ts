import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { conjunctionFragmentKey, clauseKey, clauseClusterKey } from './keys.js';

import { getChildMap } from './utils.js';

import { drawSubordinateConjunction } from '../svgDrawer/drawSubordinateConjunction.js';

export function parseSubordinateClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    conjunctionFragmentKey,
    clauseKey,
    clauseClusterKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'SubordinateClause'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'SubordinateClause parser requires SubordinateClause Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'SubordinateClause has no children',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 2) {
    if (childMap[clauseKey] && childMap[conjunctionFragmentKey]) {
      return {
        ...node,
        drawUnit: drawSubordinateConjunction(
          childMap[conjunctionFragmentKey].children[0],
          childMap[clauseKey].drawUnit,
          node.status,
        ),
      };
    }

    if (childMap[clauseClusterKey] && childMap[conjunctionFragmentKey]) {
      return {
        ...node,
        drawUnit: drawSubordinateConjunction(
          childMap[conjunctionFragmentKey].children[0],
          childMap[clauseClusterKey].drawUnit,
          node.status,
        ),
      };
    }
  }

  throw new GrammarError(
    'InvalidStructure',
    'SubordinateClause has unexpected structure',
  );
}
