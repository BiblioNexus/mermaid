import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  clauseClusterKey,
  clauseCompoundKey,
  clauseKey,
  getKeyFromNode,
  subordinateClauseKey,
} from './keys.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';

import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawCompoundEnd } from '../svgDrawer/drawCompoundEnd.js';
import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parseClauseCluster(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    (node.content.fragment !== 'ClauseCluster' &&
      node.content.fragment !== 'ClausalCluster' &&
      node.content.fragment !== 'Clausecluster')
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

  const clauseNodes = node.children.filter((child): child is GraphicalNode =>
    [clauseKey, clauseCompoundKey, clauseClusterKey].includes(
      getKeyFromNode(child),
    ),
  );

  let compoundDrawUnit = drawCompound(clauseNodes, 'dash', false, node.status);

  const subordinateClauseNode = node.children.find(
    (child) => getKeyFromNode(child) === subordinateClauseKey,
  );

  if (subordinateClauseNode) {
    const drawUnit = (subordinateClauseNode as GraphicalNode).drawUnit;

    compoundDrawUnit = horizontalMerge(
      [
        verticalMerge(
          [
            drawEmptyLine({ lineWidth: drawUnit.width, status: node.status }),
            drawUnit,
          ],
          {
            align: 'start',
            verticalCenter: 0,
          },
        ),
        drawCompoundEnd(compoundDrawUnit, 'dash', false, node.status),
      ],
      {
        align: 'center',
      },
    );
  }

  return {
    ...node,
    drawUnit: compoundDrawUnit,
  };
}
