import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectivalKey,
  appositionKey,
  articleKey,
  constructChainCompoundKey,
  constructchainKey,
  nominalKey,
  nounKey,
  relativeClauseKey,
  vocativeKey,
} from './keys.js';
import { getChildMap, havingGivenKeys } from './utils.js';
import { drawMockFragment } from '../svgDrawer/drawMockFragment.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';
import { drawCompoundEnd } from '../svgDrawer/drawCompoundEnd.js';

export function parseVocative(node: GrammarNode): GraphicalNode {
  const topKeys = [nounKey];
  const bottomKeys = [articleKey, adjectivalKey];
  const singleKeys = [appositionKey, nominalKey];
  const specialKeys = [
    constructChainCompoundKey,
    constructchainKey,
    relativeClauseKey,
    vocativeKey,
  ];
  const validKeys: string[] = [
    ...topKeys,
    ...bottomKeys,
    ...singleKeys,
    ...specialKeys,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Vocative'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Vocative parser requires Vocative Node',
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
    if (childMap[constructchainKey]) {
      return {
        ...node,
        drawUnit: childMap[constructchainKey].drawUnit,
      };
    }

    if (childMap[constructChainCompoundKey]) {
      return {
        ...node,
        drawUnit: drawCompoundEnd(
          childMap[constructChainCompoundKey].drawUnit,
          'solid',
          true,
        ),
      };
    }

    return {
      ...node,
      drawUnit: drawMockFragment(node),
    };
  }

  return {
    ...node,
    drawUnit: drawNominal({
      topKeys,
      bottomKeys,
      children: node.children as GraphicalNode[],
      isNominal: false,
    }),
  };
}
