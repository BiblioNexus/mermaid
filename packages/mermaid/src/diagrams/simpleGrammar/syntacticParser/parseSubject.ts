import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  articleKey,
  casusPendensKey,
  clauseKey,
  constructChainCompoundKey,
  constructchainKey,
  nominalCompoundKey,
  nominalKey,
  nounKey,
  pronounKey,
  relativeKey,
  verbparticipleKey,
  vocativeKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawEmpty } from '../svgDrawer/drawEmpty.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawEqualDecorator } from '../svgDrawer/drawEqualDecorator.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';
import { drawVerbparticipleDecorator } from '../svgDrawer/drawVerbparticipleDecorator.js';
import { drawSubjectClauseDecorator } from '../svgDrawer/drawSubjectClauseDecorator.js';
import { settings } from '../settings.js';
import { drawCompoundEndDecorator } from '../svgDrawer/drawCompoundEndDecorator.js';

export function parseSubject(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    verbparticipleKey,
    clauseKey,
    nounKey,
    vocativeKey,
    relativeKey,
    constructchainKey,
    articleKey,
    pronounKey,
    nominalKey,
    nominalCompoundKey,
    constructChainCompoundKey,
    casusPendensKey,
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

  if (node.children.length === 0) {
    return {
      ...node,
      drawUnit: drawEmpty(),
    };
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1) {
    if (childMap[relativeKey]) {
      return {
        ...node,
        drawUnit: drawEmpty(),
      };
    }

    if (
      childMap[nounKey] ||
      childMap[nominalKey] ||
      childMap[constructchainKey] ||
      childMap[pronounKey] ||
      childMap[casusPendensKey]
    ) {
      return {
        ...node,
        drawUnit: (node.children[0] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[nominalCompoundKey] || childMap[constructChainCompoundKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            drawCompoundEndDecorator(node.children[0] as GraphicalNode),
            (node.children[0] as GraphicalNode).drawUnit,
          ],
          {
            align: 'center',
          },
        ),
      };
    }

    if (childMap[clauseKey]) {
      const drawUnit = (childMap[clauseKey] as GraphicalNode).drawUnit;
      const height = drawUnit.verticalEnd - drawUnit.verticalCenter;

      const decorator = drawSubjectClauseDecorator(height + settings.padding);

      return {
        ...node,
        drawUnit: horizontalMerge([drawUnit, decorator], {
          horizontalStart: drawUnit.width - 2 * settings.padding,
          horizontalEnd: drawUnit.width - 2 * settings.padding,
          horizontalCenter: drawUnit.width - 2 * settings.padding,
          verticalStart: decorator.verticalStart,
          verticalCenter: decorator.height + settings.height,
          verticalEnd: decorator.height,
          align: ['center', 'start'],
        }),
      };
    }

    if (childMap[verbparticipleKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
            drawVerbparticipleDecorator(),
          ],
          {
            align: ['end', 'center'],
          },
        ),
      };
    }

    if (childMap[vocativeKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            drawEmptyWord(),
            drawEqualDecorator(),
            (childMap[vocativeKey] as GraphicalNode).drawUnit,
          ],
          { align: 'center' },
        ),
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[articleKey] && childMap[nounKey]) {
      const drawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: verticalMerge(
          [drawUnit, drawModifier(childMap[articleKey])],
          {
            align: 'center',
            verticalCenter: drawUnit.height,
            verticalEnd: drawUnit.height,
          },
        ),
      };
    }
  }

  throw new GrammarError(
    'InvalidStructure',
    'Subject has unexpected structure',
  );
}
