import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { getKeyFromNode, predicateGroupKey, predicateKey } from './keys.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawEmptyConjunction } from '../svgDrawer/drawEmptyConjunction.js';

export function parsePredicateGroup(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'PredicateGroup') {
    throw new GrammarError('InvalidParser', 'PredicateGroup parser requires PredicateGroup Node');
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'PredicateGroup has invalid length of children');
  }

  const predicateNodes = node.children.filter(
    (child) => getKeyFromNode(child) === predicateKey || getKeyFromNode(child) === predicateGroupKey
  );

  if (predicateNodes.length !== 2) {
    throw new GrammarError('InvalidStructure', 'PredicateGroup has unexpected structure');
  }

  const firstNodeDrawUnit = (predicateNodes[0] as GraphicalNode).drawUnit;
  const secondNodeDrawUnit = (predicateNodes[1] as GraphicalNode).drawUnit;
  const height =
    firstNodeDrawUnit.height - firstNodeDrawUnit.verticalCenter + secondNodeDrawUnit.verticalCenter;

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        verticalMerge(
          predicateNodes.map((node) => (node as GraphicalNode).drawUnit),
          { align: 'end', verticalStart: firstNodeDrawUnit.verticalCenter }
        ),
        drawEmptyConjunction(
          firstNodeDrawUnit.height -
            firstNodeDrawUnit.verticalCenter +
            secondNodeDrawUnit.verticalCenter
        ),
      ],
      {
        align: 'start',
        verticalStart: firstNodeDrawUnit.verticalCenter,
        verticalCenter: firstNodeDrawUnit.verticalCenter + height / 2,
        verticalEnd: firstNodeDrawUnit.verticalCenter + height,
      }
    ),
  };
}
