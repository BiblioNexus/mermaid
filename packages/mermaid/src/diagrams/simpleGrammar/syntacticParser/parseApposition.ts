import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawEqualDecorator } from '~/svgDrawer/drawEqualDecorator.js';

export function parseApposition(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Apposition'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Apposition parser requires Apposition Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Apposition has no children');
  }

  if (node.children.length === 2) {
    const firstNode = node.children[0] as GraphicalNode;
    const secondNode = node.children[1] as GraphicalNode;

    return {
      ...node,
      drawUnit: horizontalMerge(
        [secondNode.drawUnit, drawEqualDecorator(), firstNode.drawUnit],
        {
          align: 'center',
          verticalCenter: firstNode.drawUnit.verticalCenter,
          verticalEnd: firstNode.drawUnit.verticalEnd,
        },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'Apposition has unexpected structure',
  );
}
