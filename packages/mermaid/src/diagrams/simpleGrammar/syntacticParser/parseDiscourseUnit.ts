import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawContainer } from '../svgDrawer/drawContainer.js';
import { settings } from '../settings.js';

export function parseDiscourseUnit(node: GrammarNode): GraphicalNode {
  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'DiscourseUnit') {
    throw new Error('DiscourseUnit parser requires DiscourseUnit');
  }

  return {
    ...node,
    drawUnit: drawContainer(
      node,
      `${node.content.fragment} - ${node.content.description}`,
      settings.discourseUnitColor,
      settings.wordStrokeColor
    ),
  };
}
