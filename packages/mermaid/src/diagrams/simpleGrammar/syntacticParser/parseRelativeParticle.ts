import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { isWord } from '../utils.js';
import { drawRelativeParticle } from '../svgDrawer/drawRelativeParticle.js';

export function parseRelativeParticle(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'RelativeParticle'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'RelativeParticle parser requires RelativeParticle Node',
    );
  }

  if (node.children.length !== 1) {
    throw new GrammarError(
      'InvalidStructure',
      'RelativeClause has invalid children',
    );
  }

  if (
    isWord(node.children[0].content!) &&
    (node.children[0].content.pos === 'particle' ||
      node.children[0].content.pos === 'pronoun')
  ) {
    return {
      ...node,
      drawUnit: drawRelativeParticle(
        node.children[0],
        (node.children[0] as GraphicalNode).drawUnit,
        node.children[0].status,
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'Nominal has unexpected structure',
  );
}
