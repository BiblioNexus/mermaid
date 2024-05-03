import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  conjunctionFragmentKey,
  conjunctionKey,
  objectKey,
  predicateCompoundKey,
  predicateKey,
  verbKey,
} from './keys.js';

import { drawCompound } from '../svgDrawer/drawCompound.js';
import { allGivenKeys } from './utils.js';

export function parsePredicateCompound(node: GrammarNode): GraphicalNode {
  const validKeys = [
    verbKey,
    predicateKey,
    objectKey,
    predicateCompoundKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'PredicateCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'PredicateCompound parser requires PredicateCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'PredicateCompound has unexpected structure',
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
