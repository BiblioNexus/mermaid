import { isFragment } from '../utils.js';
import { ErrorType, GrammarError } from '../error.js';
import { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { conjunctionFragmentKey, clauseKey } from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge } from '../svgDrawer/utils.js';
import { drawSubordinateConjunction } from '../svgDrawer/drawSubordinateConjunction.js';

export function parseSubordinateSubordinateClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [conjunctionFragmentKey, clauseKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'SubordinateClause') {
    throw new GrammarError(
      ErrorType.InvalidParser,
      'SubordinateClause parser requires SubordinateClause Node'
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(ErrorType.InvalidStructure, 'SubordinateClause has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 2) {
    if (childMap[clauseKey] && childMap[conjunctionFragmentKey]) {
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
  }

  throw new GrammarError(ErrorType.InvalidStructure, 'Nominal has unexpected structure');
}
