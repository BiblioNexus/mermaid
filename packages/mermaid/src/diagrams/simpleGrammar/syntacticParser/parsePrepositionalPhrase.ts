import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  nounKey,
  objectGroupKey,
  objectKey,
  prepositionFragmentKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawPreposition } from '../svgDrawer/drawPreposition.js';

export function parsePrepositionalPhrase(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    prepositionFragmentKey,
    objectKey,
    objectGroupKey,
    nounKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'PrepositionalPhrase'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'PrepositionalPhrase parser requires PrepositionalPhrase Node',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  if (childMap[prepositionFragmentKey] && childMap[objectKey]) {
    const objectDrawUnit = (childMap[objectKey] as GraphicalNode).drawUnit;

    const height = objectDrawUnit.verticalCenter;

    const prepositionDrawUnit = drawPreposition(
      childMap[prepositionFragmentKey].children[0],
      height,
    );

    return {
      ...node,
      drawUnit: horizontalMerge([objectDrawUnit, prepositionDrawUnit], {
        align: ['center', 'end'],
        horizontalStart: objectDrawUnit.horizontalEnd,
        horizontalCenter:
          objectDrawUnit.width + prepositionDrawUnit.horizontalCenter,
        horizontalEnd: objectDrawUnit.width + prepositionDrawUnit.width,
      }),
    };
  }

  if (childMap[prepositionFragmentKey] && childMap[objectGroupKey]) {
    const objectDrawUnit = (childMap[objectGroupKey] as GraphicalNode).drawUnit;

    const height = objectDrawUnit.verticalCenter;

    const prepositionDrawUnit = drawPreposition(
      childMap[prepositionFragmentKey].children[0],
      height,
    );

    return {
      ...node,
      drawUnit: horizontalMerge([objectDrawUnit, prepositionDrawUnit], {
        align: ['center', 'end'],
        horizontalStart: objectDrawUnit.horizontalEnd,
        horizontalCenter: objectDrawUnit.horizontalEnd,
        horizontalEnd:
          objectDrawUnit.horizontalEnd + prepositionDrawUnit.horizontalEnd,
      }),
    };
  }

  if (childMap[prepositionFragmentKey] && childMap[nounKey]) {
    const objectDrawUnit = (childMap[nounKey] as GraphicalNode).drawUnit;

    const height = objectDrawUnit.verticalCenter;

    const prepositionDrawUnit = drawPreposition(
      childMap[prepositionFragmentKey].children[0],
      height,
    );

    return {
      ...node,
      drawUnit: horizontalMerge([objectDrawUnit, prepositionDrawUnit], {
        align: ['center', 'end'],
        horizontalStart: objectDrawUnit.horizontalEnd,
        horizontalCenter: objectDrawUnit.horizontalEnd,
        horizontalEnd:
          objectDrawUnit.horizontalEnd + prepositionDrawUnit.horizontalEnd,
      }),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'PrepositionalPhrase has unexpected structure',
  );
}
