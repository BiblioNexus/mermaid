import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  conjunctionFragmentKey,
  getKeyFromNode,
  predicateCompoundKey,
  predicateKey,
} from './keys.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawConjunction } from '../svgDrawer/drawConjunction.js';

export function parsePredicateCompound(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'PredicateCompound') {
    throw new GrammarError(
      'InvalidParser',
      'PredicateCompound parser requires PredicateCompound Node'
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'PredicateCompound has invalid length of children');
  }

  const conjunctionFragmentNode = node.children.find(
    (child) => getKeyFromNode(child) === conjunctionFragmentKey
  );

  const predicateNodes = node.children.filter(
    (child) =>
      getKeyFromNode(child) === predicateKey || getKeyFromNode(child) === predicateCompoundKey
  );

  if (predicateNodes.length !== 2 || !conjunctionFragmentNode) {
    throw new GrammarError('InvalidStructure', 'PredicateCompound has unexpected structure');
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
        drawConjunction(conjunctionFragmentNode.children[0], height),
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
