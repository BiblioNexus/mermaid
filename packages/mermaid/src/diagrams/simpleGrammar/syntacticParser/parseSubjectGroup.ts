import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { getKeyFromNode, subjectKey } from './keys.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawWord } from '../svgDrawer/drawWord.js';

export function parseSubjectGroup(node: GrammarNode): GraphicalNode {
  const requiredKeys: string[] = [subjectKey];

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'SubjectGroup has no children');
  }

  const validChildren = node.children.filter((child) =>
    requiredKeys.includes(getKeyFromNode(child)),
  );

  const keysLen = validChildren.length;

  if (keysLen > 0) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          ...validChildren.map((child) => {
            if (isFragment(child.content!)) {
              return (child as GraphicalNode).drawUnit;
            }

            return drawWord(child, true);
          }),
        ],
        { align: 'center' },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'SubjectGroup has unexpected structure',
  );
}
