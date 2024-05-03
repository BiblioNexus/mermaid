import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type {
  DrawUnit,
  GrammarNode,
  GraphicalNode,
} from '../simpleGrammarTypes.js';

import {
  clauseClusterKey,
  clauseKey,
  conjunctionFragmentKey,
  getKeyFromNode,
  subjectKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';

import { drawEmptyLine } from '../svgDrawer/drawEmptyLine.js';
import { drawComplementClauseDecorator } from '../svgDrawer/drawComplementClauseDecorator.js';
import { settings } from '../settings.js';

export function parseComplementClauseClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    conjunctionFragmentKey,
    clauseKey,
    clauseClusterKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'ComplementClause'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'ComplementClause parser requires ComplementClause Node',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  let conjunctionDrawUnit: DrawUnit;

  if (childMap[conjunctionFragmentKey]) {
    const drawUnit = childMap[conjunctionFragmentKey].drawUnit;

    conjunctionDrawUnit = verticalMerge(
      [
        drawUnit,
        drawEmptyLine({ lineWidth: drawUnit.width, status: node.status }),
      ],
      {
        align: 'center',
        verticalCenter: drawUnit.height,
      },
    );
  } else {
    conjunctionDrawUnit = drawEmptyLine({ status: node.status });
  }

  if (childMap[clauseKey]) {
    const subjectNode = childMap[clauseKey].children.find(
      (child) => getKeyFromNode(child) === subjectKey,
    );

    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          drawComplementClauseDecorator(
            childMap[clauseKey].drawUnit,
            subjectNode
              ? (subjectNode as GraphicalNode).drawUnit.width - settings.padding
              : settings.padding,
            node.status,
          ),
          conjunctionDrawUnit,
        ],
        {
          align: 'end',
        },
      ),
    };
  }

  if (childMap[clauseClusterKey]) {
    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          drawComplementClauseDecorator(
            childMap[clauseClusterKey].drawUnit,
            0,
            node.status,
          ),
          conjunctionDrawUnit,
        ],
        { align: 'end' },
      ),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'ComplementClause has unexpected structure',
  );
}
