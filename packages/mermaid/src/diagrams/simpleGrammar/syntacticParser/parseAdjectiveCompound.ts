import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { adjectiveCompoundKey, adjectiveKey, getKeyFromNode } from './keys.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

export function parseAdjectiveCompound(node: GrammarNode): GraphicalNode {
  const requiredKeys: string[] = [adjectiveKey, adjectiveCompoundKey];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'AdjectiveCompound'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'AdjectiveCompound parser requires AdjectiveCompound Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'AdjectiveCompound has no children',
    );
  }

  const validChildren = node.children.filter((child) =>
    requiredKeys.includes(getKeyFromNode(child)),
  );

  const keysLen = validChildren.length;

  if (keysLen > 0) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          ...validChildren.map((child) => {
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

  throw new GrammarError(
    'InvalidStructure',
    'AdjectiveCompound has unexpected structure',
  );
}
