import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectiveKey,
  adverbialKey,
  constructchainKey,
  verbparticipleKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawComplementDecorator } from '../svgDrawer/drawComplementDecorator.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawVerbparticipleDecorator } from '../svgDrawer/drawVerbparticipleDecorator.js';

export function parseComplement(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    adjectiveKey,
    adverbialKey,
    constructchainKey,
    verbparticipleKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Complement'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Complement parser requires Complement Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Complement has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1) {
    if (childMap[constructchainKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[constructchainKey] as GraphicalNode).drawUnit,
            drawComplementDecorator(),
          ],
          { align: 'end' },
        ),
      };
    }

    if (childMap[adjectiveKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[adjectiveKey] as GraphicalNode).drawUnit,
            drawComplementDecorator(),
          ],
          { align: 'end' },
        ),
      };
    }

    if (childMap[adverbialKey]) {
      const drawUnit = drawEmptyWord();

      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            verticalMerge(
              [drawUnit, (childMap[adverbialKey] as GraphicalNode).drawUnit],
              {
                align: 'center',
                verticalCenter: drawUnit.height,
              },
            ),
            drawComplementDecorator(),
          ],
          { align: ['center', 'end'] },
        ),
      };
    }

    if (childMap[verbparticipleKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
            drawVerbparticipleDecorator(),
            drawComplementDecorator(),
          ],
          { align: 'end' },
        ),
      };
    }
  }

  if (keysLen === 2 && childMap[adjectiveKey] && childMap[adverbialKey]) {
    const adjectiveDrawUnit = (childMap[adjectiveKey] as GraphicalNode)
      .drawUnit;
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          verticalMerge(
            [
              adjectiveDrawUnit,
              (childMap[adverbialKey] as GraphicalNode).drawUnit,
            ],
            {
              align: 'end',
              verticalCenter: adjectiveDrawUnit.height,
            },
          ),
          drawComplementDecorator(),
        ],
        {
          align: 'center',
        },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'Complement has unexpected structure',
  );
}
