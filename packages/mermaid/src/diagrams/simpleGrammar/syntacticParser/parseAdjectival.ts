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
      drawUnit: drawAdjectivalClauseDecorator(childMap[clauseKey].drawUnit),
    };
  }

  if (childMap[nominalKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          childMap[nominalKey].drawUnit,
          drawAdjectivalDecorator(childMap[nominalKey].drawUnit.verticalCenter),
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
          adverbDrawUnit: adjectiveDrawUnit,
          adverbialDrawUnit: childMap[articleKey].drawUnit,
        }),
      };
    }

    if (childMap[adverbialKey]) {
      return {
        ...node,
        drawUnit: drawAdverbialDecorator({
          adverbDrawUnit: adjectiveDrawUnit,
          adverbialDrawUnit: childMap[adverbialKey].drawUnit,
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
        drawWord(childMap[verbparticipleKey], true),
        drawAdjectivalDecorator(
          childMap[verbparticipleKey].drawUnit.verticalCenter,
        ),
      ],
      { align: ['center', 'end'] },
    );

    if (childMap[adverbialKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [verbparticipleDrawUnit, childMap[adverbialKey].drawUnit],
          { align: 'center' },
        ),
      };
    }

    if (childMap[adverbialGroupKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            verbparticipleDrawUnit,
            drawEmptyLine(verbparticipleDrawUnit.width),
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
          drawWord(childMap[verbParticipleCompoundKey]),
          drawAdjectivalDecorator(
            childMap[verbParticipleCompoundKey].drawUnit.verticalCenter,
          ),
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
