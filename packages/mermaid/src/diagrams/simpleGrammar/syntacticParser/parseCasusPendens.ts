import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { nounKey, pronounKey } from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawEmpty } from '~/svgDrawer/drawEmpty.js';

export function parseCasusPendens(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [nounKey, pronounKey];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'CasusPendens'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'CasusPendens parser requires CasusPendens Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'CasusPendens has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  // const keysLen = Object.keys(childMap).length;

  if (childMap[nounKey] && childMap[pronounKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          (childMap[nounKey] as GraphicalNode).drawUnit,
          drawEmpty(),
          (childMap[pronounKey] as GraphicalNode).drawUnit,
        ],
        {
          align: 'center',
          horizontalCenter: (childMap[nounKey] as GraphicalNode).drawUnit
            .verticalCenter,
        },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'CasusPendas has unexpected structure',
  );
}
