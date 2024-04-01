import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectivalKey,
  adjectiveKey,
  appositionKey,
  articleKey,
  clauseKey,
  complementClauseKey,
  constructChainCompoundKey,
  constructchainKey,
  nominalCompoundKey,
  nominalKey,
  nounKey,
  particleKey,
  pronounKey,
  quantifierKey,
  relativeClauseKey,
  suffixPronounKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawObjectClauseDecorator } from '../svgDrawer/drawObjectClauseDecorator.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';
import { drawEmpty } from '../svgDrawer/drawEmpty.js';

export function parseObject(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    constructchainKey,
    nounKey,
    adjectiveKey,
    adjectivalKey,
    complementClauseKey,
    particleKey,
    articleKey,
    nominalKey,
    clauseKey,
    quantifierKey,
    suffixPronounKey,
    relativeClauseKey,
    appositionKey,
    nominalCompoundKey,
    constructChainCompoundKey,
    pronounKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    (node.content.fragment !== 'Object' &&
      node.content.fragment !== 'SecondObject')
  ) {
    throw new Error('Object parser requires Object Node');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 0) {
    return {
      ...node,
      drawUnit: drawEmpty(),
    };
  }

  if (keysLen === 1) {
    if (
      childMap[constructchainKey] ||
      childMap[nounKey] ||
      childMap[pronounKey] ||
      childMap[complementClauseKey] ||
      childMap[nominalKey] ||
      childMap[suffixPronounKey] ||
      childMap[appositionKey] ||
      childMap[nominalCompoundKey] ||
      childMap[constructChainCompoundKey]
    ) {
      return {
        ...node,
        drawUnit: (node.children[0] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[clauseKey]) {
      const clauseDrawUnit = (childMap[clauseKey] as GraphicalNode).drawUnit;
      const decoratorDrawUnit = drawObjectClauseDecorator();

      return {
        ...node,
        drawUnit: verticalMerge([clauseDrawUnit, decoratorDrawUnit], {
          align: 'end',
          verticalCenter:
            decoratorDrawUnit.height + clauseDrawUnit.verticalCenter,
        }),
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[particleKey] && childMap[nounKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            (childMap[particleKey] as GraphicalNode).drawUnit,
          ],
          { align: 'end' },
        ),
      };
    }

    if (childMap[particleKey] && childMap[nominalKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[nominalKey] as GraphicalNode).drawUnit,
            (childMap[particleKey] as GraphicalNode).drawUnit,
          ],
          { align: 'end' },
        ),
      };
    }

    if (childMap[adjectiveKey] && childMap[nounKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            drawModifier(childMap[adjectiveKey]),
          ],
          {
            align: 'center',
            verticalCenter: (childMap[nounKey] as GraphicalNode).drawUnit
              .height,
          },
        ),
      };
    }

    if (childMap[adjectivalKey] && childMap[nounKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            (childMap[adjectivalKey] as GraphicalNode).drawUnit,
          ],
          {
            align: 'center',
            verticalCenter: (childMap[nounKey] as GraphicalNode).drawUnit
              .height,
          },
        ),
      };
    }

    if (childMap[articleKey] && childMap[nominalKey]) {
      return {
        ...node,
        drawUnit: (childMap[nominalKey] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[articleKey] && childMap[nounKey]) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: verticalMerge(
          [nounDrawUnit, drawModifier(childMap[articleKey])],
          {
            align: 'center',
            verticalCenter: nounDrawUnit.height,
            verticalEnd: nounDrawUnit.height,
          },
        ),
      };
    }

    if (childMap[quantifierKey] && childMap[nounKey]) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: verticalMerge(
          [nounDrawUnit, drawModifier(childMap[quantifierKey])],
          {
            align: 'center',
            verticalCenter: nounDrawUnit.height,
            verticalEnd: nounDrawUnit.height,
          },
        ),
      };
    }

    if (childMap[quantifierKey] && childMap[constructchainKey]) {
      const nounDrawUnit = (childMap[constructchainKey] as GraphicalNode)
        .drawUnit;

      return {
        ...node,
        drawUnit: verticalMerge(
          [nounDrawUnit, drawModifier(childMap[quantifierKey])],
          {
            align: 'center',
            verticalCenter: nounDrawUnit.height,
            verticalEnd: nounDrawUnit.height,
          },
        ),
      };
    }
  }

  if (keysLen === 3) {
    if (childMap[particleKey] && childMap[nounKey] && childMap[articleKey]) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            verticalMerge([nounDrawUnit, drawModifier(childMap[articleKey])], {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            }),
            (childMap[particleKey] as GraphicalNode).drawUnit,
          ],
          { align: ['center', 'end'] },
        ),
      };
    }

    if (
      childMap[relativeClauseKey] &&
      childMap[nounKey] &&
      childMap[articleKey]
    ) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[relativeClauseKey] as GraphicalNode).drawUnit,
            verticalMerge([nounDrawUnit, drawModifier(childMap[articleKey])], {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            }),
          ],
          { align: ['start', 'center'] },
        ),
      };
    }
  }

  throw new GrammarError('InvalidStructure', 'Object has unexpected structure');
}
