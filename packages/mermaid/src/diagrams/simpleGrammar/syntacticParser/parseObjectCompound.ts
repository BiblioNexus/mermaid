import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { conjunctionFragmentKey, conjunctionKey, objectKey } from './keys.js';

import { allGivenKeys } from './utils.js';
import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parseObjectCompound(node: GrammarNode): GraphicalNode {
  const validKeys = [objectKey, conjunctionFragmentKey, conjunctionKey];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ObjectCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ObjectCompound parser requires ObjectCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'ObjectCompound has unexpected structure',
    );
  }

  return {
    ...node,
    drawUnit: drawCompound(node.children as GraphicalNode[], 'solid', true),
  };
}
