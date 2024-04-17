import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawMockFragment } from '../svgDrawer/drawMockFragment.js';

export function mockParser(node: GrammarNode): GraphicalNode {
  return {
    ...node,
    drawUnit: drawMockFragment(node),
  };
}
