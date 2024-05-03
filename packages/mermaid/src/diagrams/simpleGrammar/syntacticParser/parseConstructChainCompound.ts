import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  appositionKey,
  conjunctionFragmentKey,
  conjunctionKey,
  constructchainKey,
  nominalKey,
  nounKey,
} from './keys.js';

import { allGivenKeys } from './utils.js';

import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parseConstructChainCompound(node: GrammarNode): GraphicalNode {
  const validKeys = [
    constructchainKey,
    nounKey,
    nominalKey,
    appositionKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ConstructChainCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ConstructChainCompound parser requires ConstructChainCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'ConstructChainCompound has invalid length of children',
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
