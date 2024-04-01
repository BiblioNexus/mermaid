import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { clauseClusterKey, clauseKey, conjunctionFragmentKey } from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawObjectClauseDecorator } from '../svgDrawer/drawObjectClauseDecorator.js';

export function parseComplementClauseClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    conjunctionFragmentKey,
    clauseKey,
    clauseClusterKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ComplementClause'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ComplementClause parser requires ComplementClause Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'ComplementClause has no children',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  // const keysLen = Object.keys(childMap).length;

  if (childMap[conjunctionFragmentKey] && childMap[clauseKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          verticalMerge(
            [
              (childMap[clauseKey] as GraphicalNode).drawUnit,
              drawObjectClauseDecorator(),
            ],
            { align: 'end' },
          ),
          (childMap[conjunctionFragmentKey] as GraphicalNode).drawUnit,
        ],
        { align: 'end' },
      ),
    };
  }

  if (childMap[conjunctionFragmentKey] && childMap[clauseClusterKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          verticalMerge(
            [
              (childMap[clauseClusterKey] as GraphicalNode).drawUnit,
              drawObjectClauseDecorator(),
            ],
            { align: 'end' },
          ),
          (childMap[conjunctionFragmentKey] as GraphicalNode).drawUnit,
        ],
        { align: 'end' },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'ComplementClause has unexpected structure',
  );
}
