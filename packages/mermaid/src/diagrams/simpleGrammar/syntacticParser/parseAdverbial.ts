import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adverbCompoundKey,
  adverbKey,
  adverbialCompoundKey,
  adverbialKey,
  constructchainKey,
  nominalKey,
  nounKey,
  particleKey,
  prepositionalPhraseKey,
  verbKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawAdverbialDecorator } from '../svgDrawer/drawAdverbialDecorator.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

export function parseAdverbial(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    nominalKey,
    nounKey,
    verbKey,
    particleKey,
    prepositionalPhraseKey,
    adverbKey,
    adverbialKey,
    adverbCompoundKey,
    adverbialCompoundKey,
    constructchainKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Adverbial'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Adverbial parser requires Adverbial Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Adverbial has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1) {
    if (
      childMap[nounKey] ||
      childMap[verbKey] ||
      childMap[nominalKey] ||
      childMap[constructchainKey]
    ) {
      const child = node.children[0] as GraphicalNode;

      return {
        ...node,
        drawUnit: horizontalMerge([child.drawUnit, drawAdverbialDecorator()], {
          align: 'end',
          horizontalCenter: child.drawUnit.width,
        }),
      };
    }

    if (childMap[particleKey] || childMap[adverbKey]) {
      return {
        ...node,
        drawUnit: drawModifier(node.children[0]),
      };
    }

    if (
      childMap[prepositionalPhraseKey] ||
      childMap[adverbCompoundKey] ||
      childMap[adverbialCompoundKey]
    ) {
      return {
        ...node,
        drawUnit: (node.children[0] as GraphicalNode).drawUnit,
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[adverbKey] && childMap[adverbialKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            drawModifier(childMap[adverbKey]),
            (childMap[adverbialKey] as GraphicalNode).drawUnit,
          ],
          {
            align: 'center',
          },
        ),
      };
    }
  }

  throw new GrammarError(
    'InvalidStructure',
    'Adverbial has unexpected structure',
  );
}
