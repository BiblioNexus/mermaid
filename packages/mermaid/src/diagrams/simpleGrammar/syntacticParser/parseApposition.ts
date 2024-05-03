import { isFragment, isWord } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawEqualDecorator } from '../svgDrawer/drawEqualDecorator.js';
import { drawEmpty } from '../svgDrawer/drawEmpty.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawWord } from '../svgDrawer/drawWord.js';

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

  if (node.children.length === 1) {
    let firstDrawUnit = (node.children[0] as GraphicalNode).drawUnit;

    if (node.children[0].content && isWord(node.children[0].content)) {
      firstDrawUnit = drawWord(node.children[0], {
        withLine: true,
        status: node.status,
      });
    }

    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          verticalMerge([drawEmpty(), drawEmptyLine({ status: node.status })], {
            align: 'center',
          }),
          drawEqualDecorator(),
          firstDrawUnit,
        ],
        {
          align: 'center',
          verticalCenter: firstDrawUnit.verticalCenter,
          verticalEnd: firstDrawUnit.verticalEnd,
        },
      ),
    };
  }

  if (node.children.length > 1) {
    let firstDrawUnit = (node.children[1] as GraphicalNode).drawUnit;
    let secondDrawUnit = (node.children[0] as GraphicalNode).drawUnit;

    return {
      ...node,
      drawUnit: horizontalMerge(
        [firstDrawUnit, drawEqualDecorator(), secondDrawUnit],
        {
          align: 'center',
        },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'Apposition has unexpected structure',
  );
}
