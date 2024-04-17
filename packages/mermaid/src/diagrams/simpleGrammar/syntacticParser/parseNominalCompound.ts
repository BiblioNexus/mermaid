import { isFragment } from '../utils.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  appositionKey,
  conjunctionFragmentKey,
  conjunctionKey,
  nominalKey,
  nounKey,
  pronounKey,
} from './keys.js';

import { allGivenKeys } from './utils.js';

import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parseNominalCompound(node: GrammarNode): GraphicalNode {
  const validKeys = [
    nounKey,
    pronounKey,
    nominalKey,
    appositionKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (!node.content || !isFragment(node.content)) {
    throw new GrammarError(
      'InvalidParser',
      'NominalCompound parser requires NominalCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'NominalCompound has invalid length of children',
    );
  }

  return {
    ...node,
    drawUnit: drawCompound(node.children as GraphicalNode[], 'solid', true),
  };
}
