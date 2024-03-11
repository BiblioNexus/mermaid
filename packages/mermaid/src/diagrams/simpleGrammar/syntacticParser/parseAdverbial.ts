import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adverbCompoundKey,
  adverbialCompoundKey,
  nounKey,
  particleKey,
  prepositionalPhraseKey,
  verbKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawAdverbialDecorator } from '../svgDrawer/drawAdverbialDecorator.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

export function parseAdverbial(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    nounKey,
    verbKey,
    particleKey,
    prepositionalPhraseKey,
    adverbCompoundKey,
    adverbialCompoundKey,
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
    if (childMap[nounKey]) {
      const noun = childMap[nounKey] as GraphicalNode;

      return {
        ...node,
        drawUnit: horizontalMerge([noun.drawUnit, drawAdverbialDecorator()], {
          align: 'end',
          horizontalCenter: noun.drawUnit.width,
        }),
      };
    }

    if (childMap[verbKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[verbKey] as GraphicalNode).drawUnit,
            drawAdverbialDecorator(),
          ],
          { align: 'end' },
        ),
      };
    }

    if (childMap[particleKey]) {
      return {
        ...node,
        drawUnit: drawModifier(childMap[particleKey]),
      };
    }

    if (childMap[prepositionalPhraseKey]) {
      return {
        ...node,
        drawUnit: (childMap[prepositionalPhraseKey] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[adverbCompoundKey]) {
      return {
        ...node,
        drawUnit: (childMap[adverbCompoundKey] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[adverbialCompoundKey]) {
      return {
        ...node,
        drawUnit: (childMap[adverbialCompoundKey] as GraphicalNode).drawUnit,
      };
    }
  }

  throw new GrammarError(
    'InvalidStructure',
    'Adverbial has unexpected structure',
  );
}
