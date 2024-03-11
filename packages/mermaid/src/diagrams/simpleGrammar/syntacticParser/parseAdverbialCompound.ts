import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { adverbKey, adverbialKey, conjunctionFragmentKey } from './keys.js';

import { getChildMap } from './utils.js';

import { verticalMerge } from '../svgDrawer/utils.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

export function parseAdverbialCompound(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [adverbKey, adverbialKey, conjunctionFragmentKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'AdverbialCompound') {
    throw new GrammarError(
      'InvalidParser',
      'AdverbialCompound parser requires AdverbialCompound Node'
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'AdverbialCompound has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const adverbNode = childMap[adverbKey] as GraphicalNode;
  const adverbialNode = childMap[adverbialKey] as GraphicalNode;

  return {
    ...node,
    drawUnit: verticalMerge([drawModifier(adverbNode), adverbialNode.drawUnit], {
      align: ['center', 'center'],
    }),
  };
}
