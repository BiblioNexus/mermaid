import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { conjunctionFragmentKey, getKeyFromNode, nominalKey, nounKey } from './keys.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawConjunction } from '../svgDrawer/drawConjunction.js';

export function parseNominalCompound(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'NominalCompound') {
    throw new GrammarError('InvalidParser', 'NominalCompound parser requires NominalCompound Node');
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'NominalCompound has invalid length of children');
  }

  const conjunctionFragmentNode = node.children.find(
    (child) => getKeyFromNode(child) === conjunctionFragmentKey
  );

  const nominalNodes = node.children.filter(
    (child) => getKeyFromNode(child) === nounKey || getKeyFromNode(child) === nominalKey
  );

  if (nominalNodes.length !== 2 || !conjunctionFragmentNode) {
    throw new GrammarError('InvalidStructure', 'NominalCompound has unexpected structure');
  }

  const firstNodeDrawUnit = (nominalNodes[0] as GraphicalNode).drawUnit;
  const secondNodeDrawUnit = (nominalNodes[1] as GraphicalNode).drawUnit;

  const height =
    firstNodeDrawUnit.height - firstNodeDrawUnit.verticalCenter + secondNodeDrawUnit.verticalCenter;

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        verticalMerge(
          nominalNodes.map((node) => (node as GraphicalNode).drawUnit),
          { align: 'end', verticalStart: firstNodeDrawUnit.verticalCenter }
        ),
        drawConjunction(conjunctionFragmentNode.children[0], height),
      ],
      {
        align: 'start',
        verticalCenter: firstNodeDrawUnit.verticalCenter + height / 2,
      }
    ),
  };
}
