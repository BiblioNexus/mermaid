import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { objectKey, prepositionFragmentKey } from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawPreposition } from '../svgDrawer/drawPreposition.js';

export function parsePrepositionalPhrase(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [prepositionFragmentKey, objectKey];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'PrepositionalPhrase'
  ) {
    throw new Error(
      'PrepositionalPhrase parser requires PrepositionPhrase Node',
    );
  }

  if (node.children.length !== 2) {
    throw new Error(
      'Invalid Preposition Node: Preposition Node hast invalid children',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (
    keysLen === 2 &&
    childMap[prepositionFragmentKey] &&
    childMap[objectKey]
  ) {
    const objectDrawUnit = (childMap[objectKey] as GraphicalNode).drawUnit;

    const height = objectDrawUnit.verticalEnd - objectDrawUnit.verticalStart;

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
