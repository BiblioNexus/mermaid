import { isFragment, isWord } from '../utils.js';
import { GrammarError } from '../error.js';
import type {
  DrawUnit,
  GrammarNode,
  GraphicalNode,
} from '../simpleGrammarTypes.js';

import {
  adjectivalGroupKey,
  adjectivalKey,
  adjectiveKey,
  adverbialKey,
  appositionKey,
  articleKey,
  casusPendensKey,
  clauseClusterKey,
  clauseKey,
  complementClauseKey,
  constructChainCompoundKey,
  constructchainKey,
  getKeyFromNode,
  nominalCompoundKey,
  nominalKey,
  nounKey,
  objectCompoundKey,
  objectGroupKey,
  objectKey,
  particleKey,
  predicateKey,
  pronounKey,
  quantifierKey,
  relativeClauseGroupKey,
  relativeClauseKey,
  secondObjectKey,
  subjectKey,
  suffixPronounKey,
  verbparticipleKey,
} from './keys.js';

import { getChildMap, havingGivenKeys } from './utils.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';
import { drawMockFragment } from '../svgDrawer/drawMockFragment.js';
import { drawComplementClauseDecorator } from '../svgDrawer/drawComplementClauseDecorator.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawConstructChainConnector } from '../svgDrawer/drawConstructChainConnector.js';
import { settings } from '../settings.js';
import { drawWord } from '../svgDrawer/drawWord.js';

export function parseObject(node: GrammarNode): GraphicalNode {
  const preHorizontalKeys = [
    nominalKey,
    nominalCompoundKey,
    secondObjectKey,
    objectKey,
  ];
  const afterHorizontalKeys = [particleKey];
  const topKeys = [nounKey, pronounKey, suffixPronounKey, verbparticipleKey];
  const bottomKeys = [
    adjectivalKey,
    adjectivalGroupKey,
    adverbialKey,
    adjectiveKey,
    articleKey,
    quantifierKey,
    relativeClauseKey,
    relativeClauseGroupKey,
  ];
  const singleKeys = [appositionKey, casusPendensKey, predicateKey];
  const specialKeys = [
    clauseKey,
    clauseClusterKey,
    complementClauseKey,
    objectCompoundKey,
    objectGroupKey,
    constructchainKey,
    constructChainCompoundKey,
  ];
  const validKeys: string[] = [
    ...preHorizontalKeys,
    ...afterHorizontalKeys,
    ...topKeys,
    ...bottomKeys,
    ...singleKeys,
    ...specialKeys,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    (node.content.fragment !== 'Object' &&
      node.content.fragment !== 'SecondObject')
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Object parser requires Object or SecondObject Node',
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
        drawUnit: drawConstructChainConnector(
          childMap[constructchainKey].children as GraphicalNode[],
          {
            horizontalLine: true,
            drawUnit: drawNominal({
              topKeys: [],
              bottomKeys,
              children: node.children as GraphicalNode[],
              isNominal: false,
            }),
          },
        ),
      };
    }

    if (childMap[constructChainCompoundKey]) {
      return {
        ...node,
        drawUnit: childMap[constructChainCompoundKey].drawUnit,
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

    if (childMap[clauseClusterKey]) {
      return {
        ...node,
        drawUnit: childMap[clauseClusterKey].drawUnit,
      };
    }

    if (childMap[objectCompoundKey]) {
      return {
        ...node,
        drawUnit: childMap[objectCompoundKey].drawUnit,
      };
    }

    if (childMap[complementClauseKey]) {
      return {
        ...node,
        drawUnit: childMap[complementClauseKey].drawUnit,
      };
    }

    return {
      ...node,
      drawUnit: drawMockFragment(node),
    };
  }

  const elements: DrawUnit[] = [];

  preHorizontalKeys.forEach((key) => {
    if (childMap[key]) {
      elements.push(childMap[key].drawUnit);
    }
  });

  elements.push(
    drawNominal({
      topKeys,
      bottomKeys,
      children: node.children as GraphicalNode[],
      isNominal: false,
    }),
  );

  afterHorizontalKeys.forEach((key) => {
    if (childMap[key]) {
      let drawUnit = childMap[key].drawUnit;

      if (childMap[key].content && isWord(childMap[key].content!)) {
        drawUnit = drawWord(childMap[key], true);
      }

      elements.push(drawUnit);
    }
  });

  return {
    ...node,
    drawUnit: horizontalMerge(elements, { align: 'center' }),
  };
}
