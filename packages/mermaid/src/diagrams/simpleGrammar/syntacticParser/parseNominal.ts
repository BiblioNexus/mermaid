import { isFragment, isWord } from '../utils.js';
import { GrammarError } from '../error.js';
import type {
  GrammarNode,
  GraphicalNode,
  Word,
} from '../simpleGrammarTypes.js';

import {
  nounKey,
  articleKey,
  adjectiveKey,
  verbparticipleKey,
  nominalKey,
  quantifierKey,
  constructchainKey,
  adjectivalKey,
  relativeClauseKey,
  suffixPronounKey,
  constructChainCompoundKey,
  nominalCompoundKey,
  appositionKey,
  adverbialKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { parse } from './parse.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawEmptyWord } from '../svgDrawer/drawEmptyWord.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

export function parseNominal(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    nounKey,
    articleKey,
    adjectiveKey,
    quantifierKey,
    verbparticipleKey,
    nominalKey,
    constructchainKey,
    adjectivalKey,
    adverbialKey,
    relativeClauseKey,
    suffixPronounKey,
    constructChainCompoundKey,
    nominalCompoundKey,
    appositionKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Nominal'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Nominal parser requires Nominal Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Nominal has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (childMap[nominalKey]) {
    if (
      childMap[adjectiveKey] &&
      childMap[nominalKey].children.length === 1 &&
      childMap[nominalKey].children[0].content !== null &&
      isWord(childMap[nominalKey].children[0].content!) &&
      (childMap[nominalKey].children[0].content as Word).pos ===
        'verb-participle'
    ) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[nominalKey] as GraphicalNode).drawUnit,
            drawModifier(childMap[adjectiveKey]),
          ],
          {
            align: 'center',
            verticalCenter: (childMap[nominalKey] as GraphicalNode).drawUnit
              .verticalCenter,
            verticalStart: (childMap[nominalKey] as GraphicalNode).drawUnit
              .verticalCenter,
          },
        ),
      };
    }

    return {
      ...node,
      drawUnit: (childMap[nominalKey] as GraphicalNode).drawUnit,
    };
  }

  if (keysLen === 1) {
    if (
      childMap[nounKey] ||
      childMap[suffixPronounKey] ||
      childMap[constructChainCompoundKey] ||
      childMap[nominalCompoundKey] ||
      childMap[constructchainKey] ||
      childMap[verbparticipleKey] ||
      childMap[appositionKey]
    ) {
      return {
        ...node,
        drawUnit: (node.children[0] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[adjectiveKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [drawEmptyWord(), drawModifier(childMap[adjectiveKey])],
          {
            align: 'center',
            verticalCenter: drawEmptyWord().height,
          },
        ),
      };
    }

    if (childMap[adjectivalKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            drawEmptyWord(),
            (childMap[adjectivalKey] as GraphicalNode).drawUnit,
          ],
          {
            align: 'center',
            verticalCenter: drawEmptyWord().height,
            verticalEnd: drawEmptyWord().height,
          },
        ),
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[nounKey]) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

      if (childMap[adjectiveKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [nounDrawUnit, drawModifier(childMap[adjectiveKey])],
            {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            },
          ),
        };
      }

      if (childMap[articleKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [nounDrawUnit, drawModifier(childMap[articleKey])],
            {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
              verticalEnd: nounDrawUnit.height,
            },
          ),
        };
      }

      if (childMap[quantifierKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [nounDrawUnit, drawModifier(childMap[quantifierKey])],
            {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            },
          ),
        };
      }

      if (childMap[adjectivalKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [nounDrawUnit, (childMap[adjectivalKey] as GraphicalNode).drawUnit],
            {
              align: 'end',
              verticalCenter: nounDrawUnit.height,
              verticalStart: 0,
              verticalEnd: nounDrawUnit.height,
            },
          ),
        };
      }

      if (childMap[constructchainKey]) {
        return {
          ...node,
          drawUnit: nounDrawUnit,
        };
      }

      if (childMap[relativeClauseKey]) {
        return {
          ...node,
          drawUnit: horizontalMerge(
            [
              (childMap[relativeClauseKey] as GraphicalNode).drawUnit,
              nounDrawUnit,
            ],
            {
              align: ['start', 'end'],
              verticalCenter: nounDrawUnit.height,
            },
          ),
        };
      }
    }

    if (childMap[verbparticipleKey]) {
      if (childMap[adjectiveKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [
              (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
              drawModifier(childMap[adjectiveKey]),
            ],
            { align: 'center' },
          ),
        };
      }

      if (childMap[articleKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [
              (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
              drawModifier(childMap[articleKey]),
            ],
            { align: 'center' },
          ),
        };
      }

      if (childMap[quantifierKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [
              (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
              drawModifier(childMap[quantifierKey]),
            ],
            { align: 'center' },
          ),
        };
      }

      if (childMap[adjectivalKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [
              (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
              (childMap[adjectivalKey] as GraphicalNode).drawUnit,
            ],
            {
              align: 'end',
              verticalStart: 0,
              verticalCenter: (childMap[verbparticipleKey] as GraphicalNode)
                .drawUnit.height,
              verticalEnd: (childMap[verbparticipleKey] as GraphicalNode)
                .drawUnit.height,
            },
          ),
        };
      }

      if (childMap[adverbialKey]) {
        return {
          ...node,
          drawUnit: verticalMerge(
            [
              (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
              (childMap[adverbialKey] as GraphicalNode).drawUnit,
            ],
            {
              align: 'end',
              verticalStart: 0,
              verticalCenter: (childMap[verbparticipleKey] as GraphicalNode)
                .drawUnit.height,
              verticalEnd: (childMap[adverbialKey] as GraphicalNode).drawUnit
                .height,
            },
          ),
        };
      }
    }

    if (childMap[constructchainKey] && childMap[quantifierKey]) {
      const constructchainNode = JSON.parse(
        JSON.stringify(childMap[constructchainKey]),
      );
      const quantifierNode = JSON.parse(
        JSON.stringify(childMap[quantifierKey]),
      );

      const firstNode = constructchainNode.children[0];

      if (isWord(firstNode.content!)) {
        const newNominal: GrammarNode = {
          level: 0,
          children: [firstNode, quantifierNode],
          content: {
            fragment: 'Nominal',
            description: '',
          },
        };
        constructchainNode.children[0] = newNominal;
      } else if (isFragment(firstNode.content!)) {
        firstNode.children.unshift(quantifierNode);
      }

      const newConstructChainNode = parse(constructchainNode);

      return {
        ...node,
        drawUnit: (newConstructChainNode as GraphicalNode).drawUnit,
      };
    }
  }

  if (keysLen === 3) {
    if (childMap[articleKey] && childMap[nounKey] && childMap[adjectiveKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            horizontalMerge(
              [childMap[adjectiveKey], childMap[articleKey]].map((child) =>
                drawModifier(child),
              ),
              { align: 'start' },
            ),
          ],
          { align: 'center' },
        ),
      };
    }

    if (childMap[articleKey] && childMap[nounKey] && childMap[quantifierKey]) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            horizontalMerge(
              [childMap[quantifierKey], childMap[articleKey]].map((child) =>
                drawModifier(child),
              ),
              { align: 'start' },
            ),
          ],
          {
            align: 'center',
            verticalCenter: (childMap[nounKey] as GraphicalNode).drawUnit
              .verticalEnd,
          },
        ),
      };
    }

    if (
      childMap[quantifierKey] &&
      childMap[nounKey] &&
      childMap[adjectivalKey]
    ) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[nounKey] as GraphicalNode).drawUnit,
            horizontalMerge(
              [
                (childMap[adjectivalKey] as GraphicalNode).drawUnit,
                drawModifier(childMap[quantifierKey]),
              ],
              { align: 'start' },
            ),
          ],
          {
            align: 'center',
            verticalCenter: (childMap[nounKey] as GraphicalNode).drawUnit
              .height,
          },
        ),
      };
    }

    if (
      childMap[articleKey] &&
      childMap[verbparticipleKey] &&
      childMap[adjectivalKey]
    ) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
            horizontalMerge(
              [
                (childMap[adjectivalKey] as GraphicalNode).drawUnit,
                drawModifier(childMap[articleKey]),
              ],
              { align: 'start' },
            ),
          ],
          {
            align: 'center',
            verticalCenter: (childMap[verbparticipleKey] as GraphicalNode)
              .drawUnit.height,
          },
        ),
      };
    }

    if (
      childMap[articleKey] &&
      childMap[verbparticipleKey] &&
      childMap[adjectiveKey]
    ) {
      return {
        ...node,
        drawUnit: verticalMerge(
          [
            (childMap[verbparticipleKey] as GraphicalNode).drawUnit,
            horizontalMerge(
              [
                drawModifier(childMap[adjectiveKey]),
                drawModifier(childMap[articleKey]),
              ],
              { align: 'start' },
            ),
          ],
          {
            align: 'center',
            verticalCenter: (childMap[verbparticipleKey] as GraphicalNode)
              .drawUnit.height,
          },
        ),
      };
    }

    if (
      childMap[nounKey] &&
      childMap[articleKey] &&
      childMap[relativeClauseKey]
    ) {
      const nounDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[relativeClauseKey] as GraphicalNode).drawUnit,
            verticalMerge([nounDrawUnit, drawModifier(childMap[articleKey])], {
              align: 'center',
              verticalCenter: nounDrawUnit.height,
            }),
          ],
          {
            align: ['start', 'center'],
          },
        ),
      };
    }
  }

  console.log(node);

  throw new GrammarError(
    'InvalidStructure',
    'Nominal has unexpected structure',
  );
}
