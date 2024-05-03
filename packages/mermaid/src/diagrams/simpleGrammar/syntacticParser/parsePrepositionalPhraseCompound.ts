import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  conjunctionFragmentKey,
  conjunctionKey,
  prepositionalPhraseKey,
} from './keys.js';

import { allGivenKeys } from './utils.js';
import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parsePrepositionalPhraseCompound(
  node: GrammarNode,
): GraphicalNode {
  const validKeys = [
    prepositionalPhraseKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'PrepositionalPhraseCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'PrepositionalPhraseCompound parser requires PrepositionalPhraseCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'PrepositionalPhraseCompound has unexpected structure',
    );
  }

  return {
    ...node,
    drawUnit: drawCompound(
      node.children as GraphicalNode[],
      'solid',
      true,
      node.status,
    ),
  };
}
