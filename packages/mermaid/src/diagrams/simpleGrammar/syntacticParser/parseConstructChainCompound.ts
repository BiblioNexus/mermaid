import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  conjunctionFragmentKey,
  constructChainCompoundKey,
  constructchainKey,
  getKeyFromNode,
} from './keys.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawConjunction } from '../svgDrawer/drawConjunction.js';

export function parseConstructChainCompound(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ConstructChainCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ConstructChainCompound parser requires ConstructChainCompound Node'
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'ConstructChainCompound has invalid length of children'
    );
  }

  const conjunctionFragmentNode = node.children.find(
    (child) => getKeyFromNode(child) === conjunctionFragmentKey
  );

  const constructchainNodes = node.children.filter(
    (child) =>
      getKeyFromNode(child) === constructchainKey ||
      getKeyFromNode(child) === constructChainCompoundKey
  );

  if (constructchainNodes.length !== 2 || !conjunctionFragmentNode) {
    throw new GrammarError('InvalidStructure', 'ConstructChainCompound has unexpected structure');
  }

  const firstNodeDrawUnit = (constructchainNodes[0] as GraphicalNode).drawUnit;
  firstNodeDrawUnit.verticalEnd = firstNodeDrawUnit.height;

  const secondNodeDrawUnit = (constructchainNodes[1] as GraphicalNode).drawUnit;

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        verticalMerge([firstNodeDrawUnit, secondNodeDrawUnit], {
          align: 'end',
          verticalStart: firstNodeDrawUnit.verticalCenter,
        }),
        drawConjunction(
          conjunctionFragmentNode.children[0],
          firstNodeDrawUnit.height -
            firstNodeDrawUnit.verticalCenter +
            secondNodeDrawUnit.verticalCenter
        ),
      ],
      { align: 'start' }
    ),
  };
}
