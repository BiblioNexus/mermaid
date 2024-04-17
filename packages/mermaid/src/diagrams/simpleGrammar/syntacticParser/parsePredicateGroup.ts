import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  conjunctionFragmentKey,
  conjunctionKey,
  predicateCompoundKey,
  predicateGroupKey,
  predicateKey,
} from './keys.js';
import { allGivenKeys } from './utils.js';
import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parsePredicateGroup(node: GrammarNode): GraphicalNode {
  const validKeys = [
    predicateKey,
    predicateCompoundKey,
    predicateGroupKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'PredicateGroup'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'PredicateGroup parser requires PredicateGroup Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'PredicateGroup has unexpected structure',
    );
  }
  return {
    ...node,
    drawUnit: drawCompound(node.children as GraphicalNode[], 'solid', true),
  };
}
