import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { conjunctionFragmentKey, getKeyFromNode, clauseKey, clauseCompoundKey } from './keys.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawClauseConjunction } from '../svgDrawer/drawClauseConjunction.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';

export function parseClauseCompound(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'ClauseCompound') {
    throw new GrammarError('InvalidParser', 'ClauseCompound parser requires ClauseCompound Node');
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'ClauseCompound has invalid length of children');
  }

  const conjunctionFragmentNode = node.children.find(
    (child) => getKeyFromNode(child) === conjunctionFragmentKey
  );

  const clauseNodes = node.children.filter(
    (child) => getKeyFromNode(child) === clauseKey || getKeyFromNode(child) === clauseCompoundKey
  );

  if (!conjunctionFragmentNode) {
    throw new GrammarError('InvalidStructure', 'ClauseCompound has unexpected structure');
  }

  let firstNodeDrawUnit = drawEmptyLine();
  let secondNodeDrawUnit = drawEmptyLine();

  if (clauseNodes.length === 1) {
    if (getKeyFromNode(node.children[0]) === conjunctionFragmentKey) {
      secondNodeDrawUnit = (clauseNodes[0] as GraphicalNode).drawUnit;
    } else {
      firstNodeDrawUnit = (clauseNodes[0] as GraphicalNode).drawUnit;
    }
  } else if (clauseNodes.length === 2) {
    firstNodeDrawUnit = (clauseNodes[0] as GraphicalNode).drawUnit;
    secondNodeDrawUnit = (clauseNodes[1] as GraphicalNode).drawUnit;
  } else {
    throw new GrammarError('InvalidStructure', 'ClauseCompound has unexpected structure');
  }

  const height =
    firstNodeDrawUnit.height - firstNodeDrawUnit.verticalCenter + secondNodeDrawUnit.verticalCenter;

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        verticalMerge([firstNodeDrawUnit, secondNodeDrawUnit], {
          align: 'end',
          verticalStart: firstNodeDrawUnit.verticalCenter,
          verticalCenter: firstNodeDrawUnit.verticalCenter + height,
          verticalEnd: firstNodeDrawUnit.verticalCenter + height,
        }),
        drawClauseConjunction(conjunctionFragmentNode.children[0], height),
      ],
      {
        align: 'start',
        verticalCenter: firstNodeDrawUnit.verticalCenter + height,
      }
    ),
  };
}
