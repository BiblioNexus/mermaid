import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adverbialKey,
  complementKey,
  objectKey,
  secondObjectKey,
  verbKey,
  adverbKey,
  verbinfinitiveKey,
  constructchainKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawVerticalLine } from '../svgDrawer/drawVerticalLine.js';
import { drawEmpty } from '../svgDrawer/drawEmpty.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';
import { drawVerbInifinitiveDecorator } from '../svgDrawer/drawVerbInifinitiveDecorator.js';

export function parsePredicate(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    verbKey,
    verbinfinitiveKey,
    complementKey,
    adverbialKey,
    adverbKey,
    objectKey,
    secondObjectKey,
    constructchainKey,
  ];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Predicate') {
    throw new GrammarError('InvalidParser', 'Predicate parser requires Predicate Node');
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Predicate has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1) {
    if (childMap[verbKey] || childMap[complementKey] || childMap[constructchainKey]) {
      return {
        ...node,
        drawUnit: (node.children[0] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[verbinfinitiveKey]) {
      const drawUnit = (childMap[verbinfinitiveKey] as GraphicalNode).drawUnit;
      return {
        ...node,
        drawUnit: herizontalMerge([drawUnit, drawVerbInifinitiveDecorator()], {
          align: ['end', 'center'],
          verticalCenter: drawUnit.verticalCenter,
        }),
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[verbKey]) {
      const verbDrawUnit = (childMap[verbKey] as GraphicalNode).drawUnit;

      if (childMap[complementKey]) {
        return {
          ...node,
          drawUnit: herizontalMerge(
            [(childMap[complementKey] as GraphicalNode).drawUnit, verbDrawUnit],
            { align: 'end' }
          ),
        };
      }

      if (childMap[adverbialKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [verbDrawUnit, (childMap[adverbialKey] as GraphicalNode).drawUnit],
            {
              align: 'end',
              verticalCenter: verbDrawUnit.height,
              verticalEnd: verbDrawUnit.height,
            }
          ),
        };
      }

      if (childMap[objectKey]) {
        return {
          ...node,
          drawUnit: herizontalMerge(
            [(childMap[objectKey] as GraphicalNode).drawUnit, drawVerticalLine(), verbDrawUnit],
            { align: ['center', 'end', 'end'] }
          ),
        };
      }
    }

    if (childMap[complementKey] && childMap[adverbialKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[complementKey] as GraphicalNode).drawUnit,
            verticalMerge([drawEmpty(), (childMap[adverbialKey] as GraphicalNode).drawUnit], {
              align: 'center',
            }),
          ],
          { align: ['end', 'start'] }
        ),
      };
    }

    if (childMap[complementKey] && childMap[objectKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[complementKey] as GraphicalNode).drawUnit,
            (childMap[objectKey] as GraphicalNode).drawUnit,
            drawVerticalLine(),
            drawEmptyLine(),
          ],
          { align: 'end' }
        ),
      };
    }

    if (childMap[verbinfinitiveKey] && childMap[objectKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[objectKey] as GraphicalNode).drawUnit,
            drawVerticalLine(),
            (childMap[verbinfinitiveKey] as GraphicalNode).drawUnit,
            drawVerbInifinitiveDecorator(),
          ],
          {
            align: ['end', 'end', 'end', 'center'],
          }
        ),
      };
    }

    if (childMap[constructchainKey] && childMap[objectKey]) {
      const objectDrawUnit = (childMap[objectKey] as GraphicalNode).drawUnit;
      const constructchainDrawUnit = (childMap[constructchainKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: herizontalMerge([objectDrawUnit, drawVerticalLine(), constructchainDrawUnit], {
          align: ['start', 'end', 'center'],
          verticalCenter: Math.max(
            objectDrawUnit.verticalCenter,
            constructchainDrawUnit.verticalCenter
          ),
          verticalEnd: Math.max(
            objectDrawUnit.verticalCenter,
            constructchainDrawUnit.verticalCenter
          ),
        }),
      };
    }
  }

  if (keysLen === 3) {
    if (childMap[adverbKey] && childMap[verbKey] && childMap[objectKey]) {
      const verbDrawUnit = (childMap[verbKey] as GraphicalNode).drawUnit;
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[objectKey] as GraphicalNode).drawUnit,
            drawVerticalLine(),
            verticalMerge([verbDrawUnit, drawModifier(childMap[adverbKey])], {
              align: 'center',
              verticalCenter: verbDrawUnit.height,
            }),
          ],
          { align: ['end', 'end', 'center'] }
        ),
      };
    }

    if (childMap[adverbialKey] && childMap[verbKey] && childMap[objectKey]) {
      const verbDrawUnit = (childMap[verbKey] as GraphicalNode).drawUnit;
      const adverbialDrawUnit = (childMap[adverbialKey] as GraphicalNode).drawUnit;
      const verticalDrawUnit = verticalMerge([verbDrawUnit, adverbialDrawUnit], {
        align: 'start',
        verticalCenter: verbDrawUnit.height,
      });

      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[objectKey] as GraphicalNode).drawUnit,
            drawVerticalLine(),
            verticalMerge([verbDrawUnit, adverbialDrawUnit], {
              align: 'start',
              verticalCenter: verbDrawUnit.height,
              herizontalStart: verticalDrawUnit.width - verbDrawUnit.width,
              herizontalEnd: verticalDrawUnit.width,
            }),
          ],
          { align: ['end', 'end', 'center'] }
        ),
      };
    }

    if (childMap[secondObjectKey] && childMap[verbKey] && childMap[objectKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [
            (childMap[secondObjectKey] as GraphicalNode).drawUnit,
            drawVerticalLine(),
            (childMap[objectKey] as GraphicalNode).drawUnit,
            drawVerticalLine(),
            (childMap[verbKey] as GraphicalNode).drawUnit,
          ],
          { align: 'end' }
        ),
      };
    }
  }

  throw new GrammarError('InvalidStructure', 'Predicate has unexpected structure');
}
