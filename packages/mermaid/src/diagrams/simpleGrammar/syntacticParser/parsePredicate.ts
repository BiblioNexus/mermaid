import { isFragment, isWord } from '../utils.js';
import { GrammarError } from '../error.js';
import type {
  DrawUnit,
  GrammarNode,
  GraphicalNode,
} from '../simpleGrammarTypes.js';

import {
  adverbialKey,
  complementKey,
  objectKey,
  secondObjectKey,
  verbKey,
  adverbKey,
  verbinfinitiveKey,
  constructchainKey,
  predicateCompoundKey,
  adverbialGroupKey,
  predicateGroupKey,
  verbparticipleKey,
  suffixPronounKey,
  prepositionalPhraseKey,
  predicateKey,
  copulaKey,
  verbGroupKey,
  objectGroupKey,
  complementGroupKey,
} from './keys.js';

import { getChildMap, havingGivenKeys } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';
import { drawVerticalLine } from '../svgDrawer/drawVerticalLine.js';
import { drawComplementDecorator } from '../svgDrawer/drawComplementDecorator.js';
import { drawConstructChainConnector } from '../svgDrawer/drawConstructChainConnector.js';
import { drawCompoundEnd } from '../svgDrawer/drawCompoundEnd.js';
import { drawWord } from '../svgDrawer/drawWord.js';
import { drawVerbInifinitiveDecorator } from '../svgDrawer/drawVerbInifinitiveDecorator.js';

export function parsePredicate(node: GrammarNode): GraphicalNode {
  const ignoreKeys = [suffixPronounKey, prepositionalPhraseKey];
  const specialKeys = [
    constructchainKey,
    predicateKey,
    predicateGroupKey,
    predicateCompoundKey,
    predicateGroupKey,
    objectKey,
    objectGroupKey,
    secondObjectKey,
    complementKey,
    complementGroupKey,
  ];
  const afterHorizontalKeys = [verbinfinitiveKey, verbGroupKey];
  const topKeys = [verbKey, verbparticipleKey, copulaKey];
  const bottomKeys = [adverbKey, adverbialKey, adverbialGroupKey];

  const validKeys: string[] = [
    ...ignoreKeys,
    ...specialKeys,
    ...topKeys,
    ...bottomKeys,
    ...afterHorizontalKeys,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Predicate'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Predicate parser requires Predicate Node',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  if (childMap[predicateKey] || childMap[predicateGroupKey]) {
    return {
      ...node,
      drawUnit: (node.children[0] as GraphicalNode).drawUnit,
    };
  }

  const elements: DrawUnit[] = [];

  if (childMap[complementKey]) {
    elements.push(
      horizontalMerge(
        [
          childMap[complementKey].drawUnit,
          drawComplementDecorator(node.status),
        ],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[complementGroupKey]) {
    elements.push(childMap[complementGroupKey].drawUnit);
  }

  if (childMap[secondObjectKey]) {
    elements.push(
      horizontalMerge(
        [childMap[secondObjectKey].drawUnit, drawVerticalLine(node.status)],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[objectKey]) {
    elements.push(
      horizontalMerge(
        [childMap[objectKey].drawUnit, drawVerticalLine(node.status)],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[objectGroupKey]) {
    elements.push(
      horizontalMerge(
        [childMap[objectGroupKey].drawUnit, drawVerticalLine(node.status)],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[constructchainKey]) {
    const isNotEnd = havingGivenKeys(node.children, [
      ...topKeys,
      ...bottomKeys,
    ]);

    elements.push(
      drawConstructChainConnector(
        childMap[constructchainKey].children as GraphicalNode[],
        {
          horizontalLine: isNotEnd,
          drawUnit: drawNominal({
            topKeys,
            bottomKeys,
            children: node.children as GraphicalNode[],
            isNominal: false,
            status: node.status,
          }),
          status: childMap[constructchainKey].status,
        },
      ),
    );
  } else {
    elements.push(
      drawNominal({
        topKeys,
        bottomKeys,
        children: node.children as GraphicalNode[],
        isNominal: false,
        status: node.status,
      }),
    );
  }

  if (childMap[predicateCompoundKey]) {
    const isEnd =
      elements.length === 1 &&
      !havingGivenKeys(node.children, [...topKeys, ...bottomKeys]);

    if (isEnd) {
      elements.push(childMap[predicateCompoundKey].drawUnit);
    } else {
      elements.push(
        drawCompoundEnd(
          childMap[predicateCompoundKey].drawUnit,
          'solid',
          true,
          node.status,
        ),
      );
    }
  }

  afterHorizontalKeys.forEach((key) => {
    if (childMap[key]) {
      let drawUnit = childMap[key].drawUnit;

      if (childMap[key].content && isWord(childMap[key].content!)) {
        drawUnit = drawWord(childMap[key], {
          withLine: true,
          status: node.status,
        });
      }

      if (key === verbinfinitiveKey) {
        const verbInfinitiveDrawUnit = drawWord(childMap[key], {
          withLine: true,
          status: node.status,
        });

        drawUnit = horizontalMerge(
          [verbInfinitiveDrawUnit, drawVerbInifinitiveDecorator(node.status)],
          {
            align: ['end', 'center'],
            verticalStart: verbInfinitiveDrawUnit.verticalStart,
            verticalCenter: verbInfinitiveDrawUnit.verticalCenter,
            verticalEnd: verbInfinitiveDrawUnit.verticalEnd,
          },
        );
      }

      elements.push(drawUnit);
    }
  });

  return {
    ...node,
    drawUnit:
      elements.length > 0
        ? horizontalMerge(elements, { align: 'center' })
        : drawEmptyLine({ status: node.status }),
  };
}
