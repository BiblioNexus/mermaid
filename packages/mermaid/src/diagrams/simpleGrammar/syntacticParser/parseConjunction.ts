import { isFragment, isWord } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';

export function parseConjunction(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Conjunction'
  ) {
    throw new Error('Conjunction parser requires Conjunction Node');
  }

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        ...node.children
          .map((child) => {
            if (child.content && isWord(child.content)) {
              const drawUnit = (child as GraphicalNode).drawUnit;
              return verticalMerge(
                [
                  drawUnit,
                  drawEmptyLine({
                    lineWidth: drawUnit.width,
                    status: node.status,
                  }),
                ],
                {
                  align: 'center',
                },
              );
            }

            return (child as GraphicalNode).drawUnit;
          })
          .reverse(),
      ],
      { align: 'start' },
    ),
  };
}
