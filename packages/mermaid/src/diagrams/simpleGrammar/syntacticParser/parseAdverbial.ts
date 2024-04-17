import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  adjectiveKey,
  adverbCompoundKey,
  adverbKey,
  adverbialCompoundKey,
  adverbialGroupKey,
  adverbialKey,
  articleKey,
  clauseKey,
  constructchainKey,
  nominalKey,
  nounKey,
  particleKey,
  prepositionalPhraseCompoundKey,
  prepositionalPhraseKey,
  quantifierKey,
  verbKey,
  verbinfinitiveKey,
} from './keys.js';

import { getChildMap } from './utils.js';
import { drawAdjectivalClauseDecorator } from '../svgDrawer/drawAdjectivalClauseDecorator.js';
import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawAdverbialDecorator } from '../svgDrawer/drawAdverbialDecorator.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';
import { drawNominal } from '../svgDrawer/drawNominal.js';
import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawPreposition } from '../svgDrawer/drawPreposition.js';
import { spaceWord } from '../constants.js';
import { drawVerbInifinitiveDecorator } from '../svgDrawer/drawVerbInifinitiveDecorator.js';
import { drawWord } from '../svgDrawer/drawWord.js';

export function parseAdverbial(node: GrammarNode): GraphicalNode {
  const bottomKeys = [articleKey];
  const topKeys = [nounKey, verbKey];
  const specialKeys = [
    adverbKey,
    adverbCompoundKey,
    particleKey,
    clauseKey,
    adverbialKey,
    adverbialCompoundKey,
    adverbialGroupKey,
    constructchainKey,
    nominalKey,
    quantifierKey,
    verbinfinitiveKey,
    prepositionalPhraseKey,
    prepositionalPhraseCompoundKey,
  ];

  const validKeys: string[] = [...bottomKeys, ...topKeys, ...specialKeys];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Adverbial'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Adverbial parser requires Adverbial Node',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  if (childMap[clauseKey]) {
    return {
      ...node,
      drawUnit: drawAdjectivalClauseDecorator(childMap[clauseKey].drawUnit),
    };
  }

  if (childMap[adverbCompoundKey]) {
    return {
      ...node,
      drawUnit: childMap[adverbCompoundKey].drawUnit,
    };
  }

  if (childMap[adverbialCompoundKey]) {
    const drawUnit = childMap[adverbialCompoundKey].drawUnit;

    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          verticalMerge([drawEmptyLine(drawUnit.width), drawUnit], {
            align: 'center',
            verticalCenter: 0,
          }),
          drawPreposition(spaceWord, drawUnit.verticalCenter, 'dash'),
        ],
        {
          align: ['center', 'end'],
          horizontalCenter: drawUnit.horizontalCenter,
        },
      ),
    };
  }

  if (childMap[adverbialGroupKey]) {
    const drawUnit = childMap[adverbialGroupKey].drawUnit;

    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          verticalMerge([drawEmptyLine(drawUnit.width), drawUnit], {
            align: 'center',
            verticalCenter: 0,
          }),
          drawPreposition(spaceWord, drawUnit.verticalCenter, 'dash'),
        ],
        {
          align: ['center', 'end'],
          horizontalCenter: drawUnit.horizontalCenter,
        },
      ),
    };
  }

  if (childMap[adverbialKey]) {
    if (childMap[adverbKey]) {
      return {
        ...node,
        drawUnit: drawAdverbialDecorator({
          adverbDrawUnit: childMap[adverbKey].drawUnit,
          adverbialDrawUnit: childMap[adverbialKey].drawUnit,
        }),
      };
    }

    if (childMap[adjectiveKey]) {
      return {
        ...node,
        drawUnit: drawAdverbialDecorator({
          adverbDrawUnit: childMap[adjectiveKey].drawUnit,
          adverbialDrawUnit: childMap[adverbialKey].drawUnit,
        }),
      };
    }

    return {
      ...node,
      drawUnit: childMap[adverbialKey].drawUnit,
    };
  }

  if (childMap[constructchainKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          childMap[constructchainKey].drawUnit,
          drawPreposition(
            spaceWord,
            childMap[constructchainKey].drawUnit.verticalCenter,
            'dash',
          ),
        ],
        {
          align: ['center', 'end'],
          horizontalCenter:
            childMap[constructchainKey].drawUnit.horizontalCenter,
        },
      ),
    };
  }

  if (childMap[nominalKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          childMap[nominalKey].drawUnit,
          drawPreposition(
            spaceWord,
            childMap[nominalKey].drawUnit.verticalCenter,
            'dash',
          ),
        ],
        {
          align: ['center', 'end'],
          horizontalCenter: childMap[nominalKey].drawUnit.horizontalCenter,
        },
      ),
    };
  }

  if (childMap[verbinfinitiveKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          drawWord(childMap[verbinfinitiveKey], true),
          drawVerbInifinitiveDecorator(),
          drawVerbInifinitiveDecorator(),
          drawPreposition(
            spaceWord,
            childMap[verbinfinitiveKey].drawUnit.verticalCenter,
            'dash',
          ),
        ],
        {
          align: ['center', 'center', 'center', 'end'],
          horizontalCenter:
            childMap[verbinfinitiveKey].drawUnit.horizontalCenter,
        },
      ),
    };
  }

  if (childMap[prepositionalPhraseKey]) {
    if (childMap[particleKey]) {
      return {
        ...node,
        drawUnit: childMap[prepositionalPhraseKey].drawUnit,
      };
    }

    return {
      ...node,
      drawUnit: childMap[prepositionalPhraseKey].drawUnit,
    };
  }

  if (childMap[prepositionalPhraseCompoundKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          childMap[prepositionalPhraseCompoundKey].drawUnit,
          drawPreposition(
            spaceWord,
            childMap[prepositionalPhraseCompoundKey].drawUnit.verticalCenter,
            'solid',
          ),
        ],
        {
          align: ['center', 'end'],
          horizontalCenter:
            childMap[prepositionalPhraseCompoundKey].drawUnit.verticalCenter,
        },
      ),
    };
  }

  if (childMap[adverbKey]) {
    return {
      ...node,
      drawUnit: childMap[adverbKey].drawUnit,
    };
  }

  if (childMap[adverbCompoundKey]) {
    return {
      ...node,
      drawUnit: childMap[adverbCompoundKey].drawUnit,
    };
  }

  if (childMap[particleKey]) {
    return {
      ...node,
      drawUnit: drawModifier(childMap[particleKey]),
    };
  }

  const nomainalDrawUnit = drawNominal({
    topKeys,
    bottomKeys,
    children: node.children as GraphicalNode[],
    isNominal: false,
  });

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        nomainalDrawUnit,
        drawPreposition(spaceWord, nomainalDrawUnit.verticalCenter, 'dash'),
      ],
      {
        align: ['center', 'end'],
        horizontalCenter: nomainalDrawUnit.horizontalCenter,
      },
    ),
  };
}
