import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectivalKey,
  adjectiveCompoundKey,
  adjectiveKey,
  adverbialGroupKey,
  adverbialKey,
  constructChainCompoundKey,
  constructchainKey,
  nominalCompoundKey,
  nounKey,
  verbparticipleKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawComplementDecorator } from '../svgDrawer/drawComplementDecorator.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';

export function parseComplement(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    adjectiveKey,
    adverbialKey,
    constructchainKey,
    verbparticipleKey,
    nominalCompoundKey,
    adjectiveCompoundKey,
    constructChainCompoundKey,
    adverbialGroupKey,
    nounKey,
    adjectivalKey,
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
    if (
      childMap[constructchainKey] ||
      childMap[adjectiveKey] ||
      childMap[verbparticipleKey] ||
      childMap[nominalCompoundKey] ||
      childMap[adjectiveCompoundKey] ||
      childMap[nounKey] ||
      childMap[constructChainCompoundKey]
    ) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (node.children[0] as GraphicalNode).drawUnit,
            drawComplementDecorator(),
          ],
          { align: 'end' },
        ),
      };
    }

    if (childMap[adverbialKey] || childMap[adjectivalKey]) {
      const drawUnit = drawEmptyWord();

      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            verticalMerge(
              [drawUnit, (node.children[0] as GraphicalNode).drawUnit],
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
  }

  if (childMap[adjectiveKey] && childMap[adverbialKey]) {
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

  if (childMap[verbparticipleKey] && childMap[adverbialKey]) {
    return {
      ...node,
      drawUnit: verticalMerge(
        [
          (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
          (childMap[adverbialKey] as GraphicalNode).drawUnit,
        ],
        {
          align: 'end',
          verticalCenter: (childMap[verbparticipleKey] as GraphicalNode)
            .drawUnit.height,
        },
      ),
    };
  }

  if (childMap[verbparticipleKey] && childMap[adverbialGroupKey]) {
    return {
      ...node,
      drawUnit: verticalMerge(
        [
          (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
          (childMap[adverbialGroupKey] as GraphicalNode).drawUnit,
        ],
        {
          align: 'end',
          verticalCenter: (childMap[verbparticipleKey] as GraphicalNode)
            .drawUnit.height,
        },
      ),
    };
  }

  console.log(node);

  throw new GrammarError(
    'InvalidStructure',
    'Complement has unexpected structure',
  );
}
