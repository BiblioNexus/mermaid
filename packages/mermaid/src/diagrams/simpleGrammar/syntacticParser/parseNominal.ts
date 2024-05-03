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
          node.status,
        ),
      };
    }

    if (childMap[relativeClauseKey]) {
      const drawUnit = childMap[relativeClauseKey].drawUnit;
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            verticalMerge(
              [
                drawEmptyLine({
                  lineWidth: drawUnit.width,
                  status: node.status,
                }),
                drawUnit,
              ],
              {
                align: 'end',
                verticalCenter: 0,
              },
            ),
            drawNominal({
              topKeys,
              bottomKeys,
              children: node.children as GraphicalNode[],
              isNominal: true,
              status: node.status,
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
      const constructchainKeyIndex = node.children.findIndex(
        (item) => getKeyFromNode(item) === constructchainKey,
      );
      const bottomKeyIndex = node.children.findIndex((item) =>
        bottomKeys.includes(getKeyFromNode(item)),
      );

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
              status: node.status,
            }),
            status: childMap[constructchainKey].status,
            order: bottomKeyIndex > constructchainKeyIndex ? 'before' : 'after',
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
              status: node.status,
            }),
            childMap[nominalKey].drawUnit,
          ],
          { align: 'center' },
        ),
      };
    }

    if (childMap[adjectiveKey] && childMap[adverbialKey]) {
      const drawUnit = drawAdverbialDecorator({
        props: {
          adverbDrawUnit: childMap[adjectiveKey].drawUnit,
          adverbialDrawUnit: childMap[adverbialKey].drawUnit,
        },
        status: node.status,
      });

      return {
        ...node,
        drawUnit: verticalMerge(
          [
            verticalMerge(
              [
                drawEmptyWord(node.status),
                drawEmptyLine({
                  lineWidth: drawUnit.width,
                  status: node.status,
                }),
              ],
              {
                align: 'center',
              },
            ),
            drawUnit,
          ],
          {
            align: 'end',
            verticalCenter: drawEmptyWord(node.status).height,
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
      status: node.status,
      message: node.content.message,
    }),
  };
}
