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
      drawUnit: drawAdjectivalClauseDecorator(
        childMap[clauseKey].drawUnit,
        node.status,
      ),
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
          verticalMerge(
            [
              drawEmptyLine({ lineWidth: drawUnit.width, status: node.status }),
              drawUnit,
            ],
            {
              align: 'center',
              verticalCenter: 0,
            },
          ),
          drawPreposition(spaceWord, {
            initialHeight: drawUnit.verticalCenter,
            lineType: 'dash',
            status: node.status,
          }),
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
          verticalMerge(
            [
              drawEmptyLine({ lineWidth: drawUnit.width, status: node.status }),
              drawUnit,
            ],
            {
              align: 'center',
              verticalCenter: 0,
            },
          ),
          drawPreposition(spaceWord, {
            initialHeight: drawUnit.verticalCenter,
            lineType: 'dash',
            status: node.status,
          }),
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
          props: {
            adverbDrawUnit: childMap[adverbKey].drawUnit,
            adverbialDrawUnit: childMap[adverbialKey].drawUnit,
          },
          status: node.status,
        }),
      };
    }

    if (childMap[adjectiveKey]) {
      return {
        ...node,
        drawUnit: drawAdverbialDecorator({
          props: {
            adverbDrawUnit: childMap[adjectiveKey].drawUnit,
            adverbialDrawUnit: childMap[adverbialKey].drawUnit,
          },
          status: node.status,
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
          drawPreposition(spaceWord, {
            initialHeight: childMap[constructchainKey].drawUnit.verticalCenter,
            lineType: 'dash',
            status: node.status,
          }),
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
          drawPreposition(spaceWord, {
            initialHeight: childMap[nominalKey].drawUnit.verticalCenter,
            lineType: 'dash',
            status: node.status,
          }),
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
          drawWord(childMap[verbinfinitiveKey], {
            withLine: true,
            status: node.status,
          }),
          drawVerbInifinitiveDecorator(node.status),
          drawVerbInifinitiveDecorator(node.status),
          drawPreposition(spaceWord, {
            initialHeight: childMap[verbinfinitiveKey].drawUnit.verticalCenter,
            lineType: 'dash',
            status: node.status,
          }),
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
          drawPreposition(spaceWord, {
            initialHeight:
              childMap[prepositionalPhraseCompoundKey].drawUnit.verticalCenter,
            lineType: 'solid',
            status: node.status,
          }),
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
      drawUnit: drawModifier(
        childMap[particleKey],
        childMap[particleKey].status,
      ),
    };
  }

  const nomainalDrawUnit = drawNominal({
    topKeys,
    bottomKeys,
    children: node.children as GraphicalNode[],
    isNominal: false,
    status: node.status,
  });

  return {
    ...node,
    drawUnit: horizontalMerge(
      [
        nomainalDrawUnit,
        drawPreposition(spaceWord, {
          initialHeight: nomainalDrawUnit.verticalCenter,
          lineType: 'dash',
          status: node.status,
        }),
      ],
      {
        align: ['center', 'end'],
        horizontalCenter: nomainalDrawUnit.horizontalCenter,
      },
    ),
  };
}
