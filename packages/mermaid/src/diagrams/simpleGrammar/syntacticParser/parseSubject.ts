import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { clauseKey, nounKey, relativeKey, verbparticipleKey, vocativeKey } from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge } from '../svgDrawer/utils.js';
import { drawEmpty } from '../svgDrawer/drawEmpty.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawEqualDecorator } from '../svgDrawer/drawEqualDecorator.js';
import { drawVerbparticipleDecorator } from '../svgDrawer/drawVerbparticipleDecorator.js';
import { drawSubjectClauseDecorator } from '../svgDrawer/drawSubjectClauseDecorator.js';
import { settings } from '../settings.js';

export function parseSubject(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [verbparticipleKey, clauseKey, nounKey, vocativeKey, relativeKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Subject') {
    throw new GrammarError('InvalidParser', 'Subject parser requires Subject Node');
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

    if (childMap[nounKey]) {
      return {
        ...node,
        drawUnit: (node.children[0] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[clauseKey]) {
      const drawUnit = (childMap[clauseKey] as GraphicalNode).drawUnit;
      const height = drawUnit.verticalEnd - drawUnit.verticalCenter;

      const decorator = drawSubjectClauseDecorator(height + settings.padding);

      return {
        ...node,
        drawUnit: herizontalMerge([drawUnit, decorator], {
          herizontalStart: drawUnit.width - 2 * settings.padding,
          herizontalEnd: drawUnit.width - 2 * settings.padding,
          herizontalCenter: drawUnit.width - 2 * settings.padding,
          verticalStart: decorator.verticalStart,
          verticalCenter: decorator.height + settings.height,
          verticalEnd: decorator.height,
          align: 'center',
        }),
      };
    }

    if (childMap[verbparticipleKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [(childMap[verbparticipleKey] as GraphicalNode).drawUnit, drawVerbparticipleDecorator()],
          {
            align: ['end', 'center'],
          }
        ),
      };
    }

    if (childMap[vocativeKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            drawEmptyWord(),
            drawEqualDecorator(),
            (childMap[vocativeKey] as GraphicalNode).drawUnit,
          ],
          { align: 'end' }
        ),
      };
    }
  }

  throw new GrammarError('InvalidStructure', 'Subject has unexpected structure');
}
