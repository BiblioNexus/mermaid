import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectiveCompoundKey,
  adjectiveKey,
  adverbKey,
  adverbialGroupKey,
  adverbialKey,
  articleKey,
  clauseKey,
  constructChainCompoundKey,
  constructchainKey,
  nominalKey,
  prepositionalPhraseCompoundKey,
  prepositionalPhraseKey,
  verbParticipleCompoundKey,
  verbparticipleKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { drawAdverbialDecorator } from '../svgDrawer/drawAdverbialDecorator.js';
import { drawAdjectivalClauseDecorator } from '../svgDrawer/drawAdjectivalClauseDecorator.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawWord } from '../svgDrawer/drawWord.js';
import { drawAdjectivalDecorator } from '../svgDrawer/drawAdjectivalDecorator.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';

const singleKeys = [
  prepositionalPhraseKey,
  prepositionalPhraseCompoundKey,
  adjectiveCompoundKey,
  constructchainKey,
  constructChainCompoundKey,
  adverbKey,
];

const specialKeys = [
  nominalKey,
  adverbialKey,
  clauseKey,
  adjectiveKey,
  articleKey,
  verbparticipleKey,
  verbParticipleCompoundKey,
  adverbialGroupKey,
];
const validKeys: string[] = [...specialKeys, ...singleKeys];

export function parseAdjectival(node: GrammarNode): GraphicalNode {
  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Adjectival'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Adjectival parser requires Adjectival Node',
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

  if (childMap[clauseKey]) {
    return {
      ...node,
      drawUnit: drawAdjectivalClauseDecorator(
        childMap[clauseKey].drawUnit,
        node.status,
      ),
    };
  }

  if (childMap[nominalKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          childMap[nominalKey].drawUnit,
          drawAdjectivalDecorator({
            height: childMap[nominalKey].drawUnit.verticalCenter,
            status: node.status,
          }),
        ],
        { align: ['center', 'end'] },
      ),
    };
  }

  if (childMap[adjectiveKey]) {
    const adjectiveDrawUnit = childMap[adjectiveKey].drawUnit;

    if (childMap[articleKey]) {
      return {
        ...node,
        drawUnit: drawAdverbialDecorator({
          props: {
            adverbDrawUnit: adjectiveDrawUnit,
            adverbialDrawUnit: childMap[articleKey].drawUnit,
          },
          status: node.status,
        }),
      };
    }

    if (childMap[adverbialKey]) {
      return {
        ...node,
        drawUnit: drawAdverbialDecorator({
          props: {
            adverbDrawUnit: adjectiveDrawUnit,
            adverbialDrawUnit: childMap[adverbialKey].drawUnit,
          },
          status: node.status,
        }),
      };
    }

    return {
      ...node,
      drawUnit: adjectiveDrawUnit,
    };
  }

  if (childMap[verbparticipleKey]) {
    const verbparticipleDrawUnit = horizontalMerge(
      [
        drawWord(childMap[verbparticipleKey], {
          withLine: true,
          status: node.status,
        }),
        drawAdjectivalDecorator({
          height: childMap[verbparticipleKey].drawUnit.verticalCenter,
          status: node.status,
        }),
      ],
      { align: ['center', 'end'] },
    );

    if (childMap[adverbialKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [verbparticipleDrawUnit, childMap[adverbialKey].drawUnit],
          {
            align: 'center',
          },
        ),
      };
    }

    if (childMap[adverbialGroupKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            verbparticipleDrawUnit,
            drawEmptyLine({
              lineWidth: verbparticipleDrawUnit.width,
              status: node.status,
            }),
            childMap[adverbialGroupKey].drawUnit,
          ],
          {
            align: 'center',
          },
        ),
      };
    }

    return {
      ...node,
      drawUnit: verbparticipleDrawUnit,
    };
  }

  if (childMap[verbParticipleCompoundKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          drawWord(childMap[verbParticipleCompoundKey], {
            status: node.status,
          }),
          drawAdjectivalDecorator({
            height: childMap[verbParticipleCompoundKey].drawUnit.verticalCenter,
            status: node.status,
          }),
        ],
        { align: ['center', 'end'] },
      ),
    };
  }

  if (childMap[adverbialKey]) {
    return {
      ...node,
      drawUnit: childMap[adverbialKey].drawUnit,
    };
  }

  if (childMap[adverbialGroupKey]) {
    return {
      ...node,
      drawUnit: childMap[adverbialGroupKey].drawUnit,
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'Adjectival parser requires Adjectival Node',
  );
}
