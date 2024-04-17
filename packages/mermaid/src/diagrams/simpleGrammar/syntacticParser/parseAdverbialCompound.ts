import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adverbKey,
  adverbialKey,
  conjunctionFragmentKey,
  conjunctionKey,
  getKeyFromNode,
} from './keys.js';

import { allGivenKeys } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

export function parseAdverbialCompound(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    adverbKey,
    adverbialKey,
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'AdverbialCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'AdverbialCompound parser requires AdverbialCompound Node',
    );
  }

  const allValid = allGivenKeys(node.children, validKeys);

  if (!allValid || node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'AdverbialCompound has unexpected structure',
    );
  }

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        ...node.children
          .filter(
            (child) =>
              !(
                getKeyFromNode(child) === conjunctionFragmentKey ||
                getKeyFromNode(child) === conjunctionKey
              ),
          )
          .map((child) => {
            if (isFragment(child.content!)) {
              return (child as GraphicalNode).drawUnit;
            }

            return drawModifier(child);
          }),
      ],
      { align: 'start' },
    ),
  };
}
