import { isFragment } from '../utils.js';
import { ErrorType, GrammarError } from '../error.js';
import { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { relativeParticleKey, clauseKey } from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge } from '../svgDrawer/utils.js';
import { drawRelativeParticle } from '../svgDrawer/drawRelativeParticle.js';

export function parseRelativeClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [relativeParticleKey, clauseKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'RelativeClause') {
    throw new GrammarError(
      ErrorType.InvalidParser,
      'RelativeClause parser requires RelativeClause Node'
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(ErrorType.InvalidStructure, 'RelativeClause has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 2) {
    if (childMap[relativeParticleKey] && childMap[clauseKey]) {
      const relativeParticleNode = childMap[relativeParticleKey].children[0];
      const clauseDrawUnit = (childMap[clauseKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: herizontalMerge(
          [clauseDrawUnit, drawRelativeParticle(relativeParticleNode, clauseDrawUnit.height)],
          { align: 'center' }
        ),
      };
    }
  }

  throw new GrammarError(ErrorType.InvalidStructure, 'Nominal has unexpected structure');
}
