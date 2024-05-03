import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectivalKey,
  adjectiveCompoundKey,
  adjectivalGroupKey,
  adjectiveKey,
  adverbKey,
  adverbialCompoundKey,
  adverbialGroupKey,
  adverbialKey,
  appositionKey,
  clauseKey,
  constructChainCompoundKey,
  constructchainKey,
  nominalCompoundKey,
  nominalKey,
  nounKey,
  prepositionalPhraseKey,
  verbKey,
  verbParticipleCompoundKey,
  verbparticipleKey,
} from './keys.js';

import { getChildMap, havingGivenKeys } from './utils.js';

import { drawMockFragment } from '../svgDrawer/drawMockFragment.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';

export function parseComplement(node: GrammarNode): GraphicalNode {
  const specialKeys = [
    constructchainKey,
    constructChainCompoundKey,
    nominalKey,
    nominalCompoundKey,
  ];

  const singleKeys = [appositionKey, clauseKey, verbParticipleCompoundKey];
  const afterHorizontalKeys = [verbparticipleKey];

  const validKeys: string[] = [
    ...specialKeys,
    ...singleKeys,
    ...afterHorizontalKeys,
    adjectivalKey,
    adverbialKey,
    adjectiveKey,
    adverbKey,
    prepositionalPhraseKey,
    adjectiveCompoundKey,
    adjectivalGroupKey,
    adverbialCompoundKey,
    adverbialGroupKey,
    nounKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Complement'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Complement parser requires Complement Node',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  for (const key of singleKeys) {
    if (childMap[key]) {
      return {
        ...node,
        drawUnit: childMap[key].drawUnit,
      };
    }
  }

  if (havingGivenKeys(node.children, specialKeys)) {
    if (childMap[constructChainCompoundKey]) {
      return {
        ...node,
        drawUnit: childMap[constructChainCompoundKey].drawUnit,
      };
    }

    if (childMap[constructchainKey]) {
      return {
        ...node,
        drawUnit: childMap[constructchainKey].drawUnit,
      };
    }

    if (childMap[nominalKey]) {
      return {
        ...node,
        drawUnit: childMap[nominalKey].drawUnit,
      };
    }

    if (childMap[nominalCompoundKey]) {
      return {
        ...node,
        drawUnit: childMap[nominalCompoundKey].drawUnit,
      };
    }

    return {
      ...node,
      drawUnit: drawMockFragment(node),
    };
  }

  const topKeys = [];
  const bottomKeys = [];

  if (childMap[nounKey]) {
    topKeys.push(nounKey);
    bottomKeys.push(
      ...[
        adjectiveKey,
        adjectiveCompoundKey,
        adjectivalGroupKey,
        adjectivalKey,
        prepositionalPhraseKey,
      ],
    );
  } else if (childMap[verbKey] || childMap[verbparticipleKey]) {
    topKeys.push(...[verbKey, verbparticipleKey]);
    bottomKeys.push(
      ...[
        adverbKey,
        adverbialKey,
        adverbialGroupKey,
        adverbialCompoundKey,
        prepositionalPhraseKey,
      ],
    );
  } else if (childMap[adjectiveKey]) {
    topKeys.push(adjectiveKey);
    bottomKeys.push(...[adverbKey, adverbialKey, adverbialCompoundKey]);
  } else {
    bottomKeys.push(
      ...[
        adverbKey,
        adverbialKey,
        adjectivalKey,
        adverbialCompoundKey,
        adverbialGroupKey,
        adjectiveCompoundKey,
        adjectivalGroupKey,
        prepositionalPhraseKey,
      ],
    );
  }

  return {
    ...node,
    drawUnit: drawNominal({
      topKeys,
      bottomKeys,
      children: node.children as GraphicalNode[],
      isNominal: false,
      status: node.status,
    }),
  };
}
