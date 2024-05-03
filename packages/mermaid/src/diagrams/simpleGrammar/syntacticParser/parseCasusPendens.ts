import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  getKeyFromNode,
  nominalKey,
  nounKey,
  pronounKey,
  suffixPronounKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';

import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawSpacer } from '../svgDrawer/drawSpacer.js';

export function parseCasusPendens(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    nounKey,
    pronounKey,
    nominalKey,
    suffixPronounKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'CasusPendens'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'CasusPendens parser requires CasusPendens Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'CasusPendens has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 2) {
    const firstNode = node.children[0] as GraphicalNode;
    const secondNode = node.children[1] as GraphicalNode;

    let firstNodeDrawUnit = firstNode.drawUnit;
    let secondNodeDrawUnit = secondNode.drawUnit;

    if (
      [nounKey, pronounKey, suffixPronounKey].includes(
        getKeyFromNode(firstNode),
      )
    ) {
      firstNodeDrawUnit = verticalMerge(
        [
          firstNode.drawUnit,
          drawEmptyLine({
            lineWidth: firstNode.drawUnit.width,
            status: node.status,
          }),
        ],
        { align: 'center', verticalCenter: firstNodeDrawUnit.verticalCenter },
      );
    }

    if (
      [nounKey, pronounKey, suffixPronounKey].includes(
        getKeyFromNode(secondNode),
      )
    ) {
      secondNodeDrawUnit = verticalMerge(
        [
          secondNode.drawUnit,
          drawEmptyLine({
            lineWidth: secondNode.drawUnit.width,
            status: node.status,
          }),
        ],
        { align: 'center', verticalCenter: firstNodeDrawUnit.verticalCenter },
      );
    }

    return {
      ...node,
      drawUnit: horizontalMerge(
        [secondNodeDrawUnit, drawSpacer(), firstNodeDrawUnit],
        {
          align: 'center',
          horizontalCenter: (childMap[nounKey] as GraphicalNode).drawUnit
            .verticalCenter,
        },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'CasusPendens has unexpected structure',
  );
}
