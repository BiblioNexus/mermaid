import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  adjectiveKey,
  conjunctionFragmentKey,
  conjunctionKey,
  verbparticipleKey,
} from './keys.js';

import { allGivenKeys } from './utils.js';

import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parseVerbparticipleCompound(node: GrammarNode): GraphicalNode {
  const validKeys = [
    verbparticipleKey,
    adjectiveKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'VerbParticipleCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'VerbParticipleCompound parser requires VerbParticipleCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'VerbParticipleCompound has invalid length of children',
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
