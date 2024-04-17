import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectivalKey,
  adjectiveKey,
  appositionKey,
  articleKey,
  casusPendensKey,
  clauseKey,
  constructChainCompoundKey,
  constructchainKey,
  getKeyFromNode,
  nominalCompoundKey,
  nominalGroupKey,
  nominalKey,
  nounKey,
  objectKey,
  predicateKey,
  pronounKey,
  relativeClauseKey,
  subjectKey,
  verbparticipleKey,
  vocativeKey,
} from './keys.js';

import { getChildMap, havingGivenKeys } from './utils.js';

import { drawMockFragment } from '../svgDrawer/drawMockFragment.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawConstructChainConnector } from '../svgDrawer/drawConstructChainConnector.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawEqualDecorator } from '../svgDrawer/drawEqualDecorator.js';
import { drawComplementClauseDecorator } from '../svgDrawer/drawComplementClauseDecorator.js';
import { settings } from '../settings.js';
import { drawCompoundEnd } from '../svgDrawer/drawCompoundEnd.js';

export function parseSubject(node: GrammarNode): GraphicalNode {
  const topKeys = [nounKey, pronounKey, verbparticipleKey];
  const bottomKeys = [
    adjectivalKey,
    adjectiveKey,
    articleKey,
    relativeClauseKey,
  ];
  const singleKeys = [appositionKey, casusPendensKey, objectKey, predicateKey];
  const specialKeys = [
    clauseKey,
    nominalCompoundKey,
    nominalGroupKey,
    nominalKey,
    constructChainCompoundKey,
    constructchainKey,
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
    node.content.fragment !== 'Subject'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Subject parser requires Subject Node',
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
          { horizontalLine: true },
        ),
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

    if (childMap[nominalKey]) {
      if (childMap[adjectivalKey]) {
        const nominalDrawUnit = childMap[nominalKey].drawUnit;
        const adjectivalDrawUnit = childMap[adjectivalKey].drawUnit;

        return {
          ...node,
          drawUnit: verticalMerge(
            [
              nominalDrawUnit,
              drawEmptyLine(
                Math.max(nominalDrawUnit.width, adjectivalDrawUnit.width),
              ),
              adjectivalDrawUnit,
            ],
            { align: 'end' },
          ),
        };
      }

      return {
        ...node,
        drawUnit: childMap[nominalKey].drawUnit,
      };
    }

    if (childMap[nominalGroupKey]) {
      return {
        ...node,
        drawUnit: drawCompoundEnd(
          childMap[nominalGroupKey].drawUnit,
          'solid',
          true,
        ),
      };
    }

    if (childMap[nominalCompoundKey]) {
      return {
        ...node,
        drawUnit: drawCompoundEnd(
          childMap[nominalCompoundKey].drawUnit,
          'solid',
          true,
        ),
      };
    }

    if (childMap[vocativeKey]) {
      const drawUnit = verticalMerge([drawEmptyWord(), drawEmptyLine()], {
        align: 'center',
        verticalCenter: drawEmptyWord().height,
      });

      return {
        ...node,
        drawUnit: horizontalMerge(
          [drawUnit, drawEqualDecorator(), childMap[vocativeKey].drawUnit],
          {
            align: 'center',
          },
        ),
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
