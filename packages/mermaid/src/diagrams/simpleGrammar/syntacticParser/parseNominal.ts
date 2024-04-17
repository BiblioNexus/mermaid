import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  nounKey,
  articleKey,
  adjectiveKey,
  verbparticipleKey,
  nominalKey,
  quantifierKey,
  constructchainKey,
  adjectivalKey,
  relativeClauseKey,
  suffixPronounKey,
  constructChainCompoundKey,
  nominalCompoundKey,
  appositionKey,
  adverbialKey,
  clauseKey,
  clauseClusterKey,
  complementClauseKey,
  prepositionalPhraseKey,
  particleKey,
  pronounKey,
  getKeyFromNode,
  clauseCompoundKey,
  subjectKey,
} from './keys.js';

import { getChildMap, havingGivenKeys } from './utils.js';

import { drawMockFragment } from '../svgDrawer/drawMockFragment.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';
import { drawComplementClauseDecorator } from '../svgDrawer/drawComplementClauseDecorator.js';
import { settings } from '../settings.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawConstructChainConnector } from '../svgDrawer/drawConstructChainConnector.js';
import { drawAdverbialDecorator } from '../svgDrawer/drawAdverbialDecorator.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';

const topKeys = [
  nounKey,
  particleKey,
  pronounKey,
  verbparticipleKey,
  suffixPronounKey,
];
const bottomKeys = [
  adjectivalKey,
  adverbialKey,
  adjectiveKey,
  articleKey,
  quantifierKey,
];
const specialKeys = [prepositionalPhraseKey, clauseKey, relativeClauseKey];

const singleKeys = [
  nominalCompoundKey,
  appositionKey,
  clauseClusterKey,
  clauseCompoundKey,
  complementClauseKey,
  constructChainCompoundKey,
];

const validKeys: string[] = [
  ...topKeys,
  ...bottomKeys,
  ...specialKeys,
  ...singleKeys,
  constructchainKey,
  nominalKey,
];

export function parseNominal(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Nominal'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Nominal parser requires Nominal Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Nominal has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1 && singleKeys.includes(getKeyFromNode(node.children[0]))) {
    return {
      ...node,
      drawUnit: (node.children[0] as GraphicalNode).drawUnit,
    };
  }

  if (havingGivenKeys(node.children, specialKeys)) {
    if (childMap[constructchainKey]) {
      return {
        ...node,
        drawUnit: childMap[constructchainKey].drawUnit,
      };
    }

    if (childMap[clauseKey]) {
      const subjectNode = childMap[clauseKey].children.find(
        (child) => getKeyFromNode(child) === subjectKey,
      );

      return {
        ...node,
        drawUnit: drawComplementClauseDecorator(
          childMap[clauseKey].drawUnit,
          subjectNode
            ? (subjectNode as GraphicalNode).drawUnit.width - settings.padding
            : settings.padding,
        ),
      };
    }

    if (childMap[relativeClauseKey]) {
      const drawUnit = childMap[relativeClauseKey].drawUnit;
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            verticalMerge([drawEmptyLine(drawUnit.width), drawUnit], {
              align: 'end',
              verticalCenter: 0,
            }),
            drawNominal({
              topKeys,
              bottomKeys,
              children: node.children as GraphicalNode[],
              isNominal: true,
            }),
          ],
          { align: 'center' },
        ),
      };
    }

    return {
      ...node,
      drawUnit: drawMockFragment(node),
    };
  }

  if (!havingGivenKeys(node.children, topKeys)) {
    if (childMap[constructchainKey]) {
      return {
        ...node,
        drawUnit: drawConstructChainConnector(
          childMap[constructchainKey].children as GraphicalNode[],
          {
            drawUnit: drawNominal({
              topKeys,
              bottomKeys,
              children: node.children as GraphicalNode[],
              isNominal: false,
            }),
          },
        ),
      };
    }
    if (childMap[nominalKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            drawNominal({
              topKeys,
              bottomKeys,
              children: node.children as GraphicalNode[],
              isNominal: false,
            }),
            childMap[nominalKey].drawUnit,
          ],
          { align: 'center' },
        ),
      };
    }

    if (childMap[adjectiveKey] && childMap[adverbialKey]) {
      const drawUnit = drawAdverbialDecorator({
        adverbDrawUnit: childMap[adjectiveKey].drawUnit,
        adverbialDrawUnit: childMap[adverbialKey].drawUnit,
      });

      return {
        ...node,
        drawUnit: verticalMerge(
          [
            verticalMerge([drawEmptyWord(), drawEmptyLine(drawUnit.width)], {
              align: 'center',
            }),
            drawUnit,
          ],
          {
            align: 'end',
            verticalCenter: drawEmptyWord().height,
          },
        ),
      };
    }
  }

  return {
    ...node,
    drawUnit: drawNominal({
      topKeys,
      bottomKeys,
      children: node.children as GraphicalNode[],
      isNominal: true,
    }),
  };
}
