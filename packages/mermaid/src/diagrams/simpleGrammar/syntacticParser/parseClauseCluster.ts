import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { clauseKey, getKeyFromNode } from './keys.js';
import { horizontalMerge, verticalMerge } from '~/svgDrawer/utils.js';
import { drawEmptyClauseConjunction } from '../svgDrawer/drawEmptyClauseConjunction.js';

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

  if (node.children.length === 1) {
    return {
      ...node,
      drawUnit: (node.children[0] as GraphicalNode).drawUnit,
    };
  }

  const clauseNodes = node.children.filter(
    (child): child is GraphicalNode => getKeyFromNode(child) === clauseKey,
  );

  let firstNodeDrawUnit = clauseNodes[0].drawUnit;

  for (let i = 1; i < clauseNodes.length; i++) {
    const clauseNode = clauseNodes[i];

    let secondNodeDrawUnit = clauseNode.drawUnit;

    const height =
      firstNodeDrawUnit.height -
      firstNodeDrawUnit.verticalCenter +
      secondNodeDrawUnit.verticalCenter;

    firstNodeDrawUnit = horizontalMerge(
      [
        verticalMerge([firstNodeDrawUnit, secondNodeDrawUnit], {
          align: 'end',
          verticalStart: firstNodeDrawUnit.verticalCenter,
          verticalCenter: firstNodeDrawUnit.verticalCenter + height,
          verticalEnd: firstNodeDrawUnit.verticalCenter + height,
        }),
        drawEmptyClauseConjunction(height),
      ],
      {
        align: 'start',
        verticalCenter: firstNodeDrawUnit.verticalCenter + height,
      },
    );
  }

  return {
    ...node,
    drawUnit: firstNodeDrawUnit,
  };
}
