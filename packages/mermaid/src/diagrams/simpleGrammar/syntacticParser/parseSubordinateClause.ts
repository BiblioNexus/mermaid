import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { conjunctionFragmentKey, clauseKey } from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge } from '../svgDrawer/utils.js';
import { drawSubordinateConjunction } from '../svgDrawer/drawSubordinateConjunction.js';

export function parseSubordinateSubordinateClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [conjunctionFragmentKey, clauseKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'SubordinateClause') {
    throw new GrammarError(
      'InvalidParser',
      'SubordinateClause parser requires SubordinateClause Node'
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'SubordinateClause has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 2 && childMap[clauseKey] && childMap[conjunctionFragmentKey]) {
    return {
      ...node,
      drawUnit: herizontalMerge(
        [
          (childMap[clauseKey] as GraphicalNode).drawUnit,
          drawSubordinateConjunction(childMap[conjunctionFragmentKey]),
        ],
        {
          align: 'end',
        }
      ),
    };
  }

  throw new GrammarError('InvalidStructure', 'Nominal has unexpected structure');
}
