import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  conjunctionFragmentKey,
  clauseKey,
  clauseCompoundKey,
  conjunctionKey,
  clausalClusterKey,
} from './keys.js';
import { allGivenKeys } from './utils.js';
import { drawCompound } from '../svgDrawer/drawCompound.js';

export function parseClauseCompound(node: GrammarNode): GraphicalNode {
  const validKeys = [
    clauseKey,
    clauseCompoundKey,
    clausalClusterKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'ClauseCompound has unexpected structure',
    );
  }

  return {
    ...node,
    drawUnit: drawCompound(
      node.children as GraphicalNode[],
      'dash',
      false,
      node.status,
    ),
  };
}
