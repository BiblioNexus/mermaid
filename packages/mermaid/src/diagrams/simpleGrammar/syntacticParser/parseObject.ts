import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  articleKey,
  clauseKey,
  complementClauseKey,
  constructchainKey,
  nominalKey,
  nounKey,
  particleKey,
  relativeClauseKey,
  suffixPronounKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawObjectClauseDecorator } from '../svgDrawer/drawObjectClauseDecorator.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';
import { drawEmpty } from '../svgDrawer/drawEmpty.js';

export function parseObject(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    constructchainKey,
    nounKey,
    complementClauseKey,
    particleKey,
    articleKey,
    nominalKey,
    clauseKey,
    suffixPronounKey,
    relativeClauseKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    (node.content.fragment !== 'Object' && node.content.fragment !== 'SecondObject')
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
      childMap[complementClauseKey] ||
      childMap[nominalKey] ||
      childMap[suffixPronounKey]
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
          verticalCenter: decoratorDrawUnit.height + clauseDrawUnit.verticalCenter,
        }),
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[particleKey] && childMap[nounKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            (childMap[particleKey] as GraphicalNode).drawUnit,
          ],
          { align: 'end' }
        ),
      };
    }

    if (childMap[articleKey] && childMap[nominalKey]) {
      return {
        ...node,
        drawUnit: (childMap[nominalKey] as GraphicalNode).drawUnit,
      };
    }
  }

  if (keysLen === 3) {
    if (childMap[particleKey] && childMap[nounKey] && childMap[articleKey]) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            verticalMerge([nounDrawUnit, drawModifier(childMap[articleKey])], {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            }),
            (childMap[particleKey] as GraphicalNode).drawUnit,
          ],
          { align: ['center', 'end'] }
        ),
      };
    }

    if (childMap[relativeClauseKey] && childMap[nounKey] && childMap[articleKey]) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[relativeClauseKey] as GraphicalNode).drawUnit,
            verticalMerge([nounDrawUnit, drawModifier(childMap[articleKey])], {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            }),
          ],
          { align: ['start', 'center'] }
        ),
      };
    }
  }

  throw new GrammarError('InvalidStructure', 'Nominal has unexpected structure');
}
