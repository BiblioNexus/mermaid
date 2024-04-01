import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import {
  subjectKey,
  predicateKey,
  vocativeKey,
  subordinateClauseKey,
  complementKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { horizontalMerge, verticalMerge } from '../svgDrawer/utils.js';
import { drawClauseDecorator } from '../svgDrawer/drawClauseDecorator.js';
import { drawWhitespaceDecorator } from '../svgDrawer/drawWhitespaceDecorator.js';

export function parseClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    subjectKey,
    predicateKey,
    vocativeKey,
    subordinateClauseKey,
    complementKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'Clause'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'Clause parser requires Clause Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError('InvalidStructure', 'Clause has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1) {
    const drawUnit = (node.children[0] as GraphicalNode).drawUnit;

    if (childMap[predicateKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge([drawUnit, drawClauseDecorator()], {
          align: 'center',
          verticalCenter: drawUnit.verticalCenter,
          verticalEnd: drawUnit.verticalEnd,
        }),
      };
    }

    if (childMap[subjectKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge([drawClauseDecorator(), drawUnit], {
          align: 'center',
          verticalCenter: drawUnit.verticalCenter,
          verticalEnd: drawUnit.verticalEnd,
        }),
      };
    }
  }

  if (keysLen === 2) {
    if (childMap[subjectKey] && childMap[predicateKey]) {
      const subjectUnit = (childMap[subjectKey] as GraphicalNode).drawUnit;
      const decorator = drawClauseDecorator();
      const predicateUnit = (childMap[predicateKey] as GraphicalNode).drawUnit;

      return {
        ...node,
        drawUnit: horizontalMerge([predicateUnit, decorator, subjectUnit], {
          align: ['center', 'center', 'center'],
          verticalCenter: Math.max(
            subjectUnit.verticalCenter,
            predicateUnit.verticalCenter,
          ),
          verticalEnd: Math.max(
            subjectUnit.verticalEnd,
            predicateUnit.verticalEnd,
          ),
        }),
      };
    }

    if (childMap[subjectKey] && childMap[complementKey]) {
      const subjectUnit = (childMap[subjectKey] as GraphicalNode).drawUnit;
      const decorator = drawClauseDecorator();
      const complementUnit = (childMap[complementKey] as GraphicalNode)
        .drawUnit;

      return {
        ...node,
        drawUnit: horizontalMerge([complementUnit, decorator, subjectUnit], {
          align: ['center', 'center', 'center'],
          verticalCenter: Math.max(
            subjectUnit.verticalCenter,
            complementUnit.verticalCenter,
          ),
          verticalEnd: Math.max(
            subjectUnit.verticalEnd,
            complementUnit.verticalEnd,
          ),
        }),
      };
    }

    if (childMap[vocativeKey] && childMap[predicateKey]) {
      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[predicateKey] as GraphicalNode).drawUnit,
            drawClauseDecorator(),
            drawWhitespaceDecorator(),
            (childMap[vocativeKey] as GraphicalNode).drawUnit,
          ],
          { align: ['end', 'center', 'center', 'end'] },
        ),
      };
    }

    if (childMap[predicateKey] && childMap[subordinateClauseKey]) {
      const decoratorDrawUnit = drawClauseDecorator();
      const subordinateClauseDrawUnit = (
        childMap[subordinateClauseKey] as GraphicalNode
      ).drawUnit;

      return {
        ...node,
        drawUnit: horizontalMerge(
          [
            (childMap[predicateKey] as GraphicalNode).drawUnit,
            verticalMerge([decoratorDrawUnit, subordinateClauseDrawUnit], {
              align: 'center',
              horizontalStart:
                subordinateClauseDrawUnit.horizontalCenter -
                decoratorDrawUnit.horizontalCenter,
              horizontalCenter: decoratorDrawUnit.horizontalCenter,
              horizontalEnd: decoratorDrawUnit.horizontalEnd,
              verticalStart: decoratorDrawUnit.verticalStart,
              verticalCenter: decoratorDrawUnit.verticalCenter,
              verticalEnd: decoratorDrawUnit.verticalEnd,
            }),
          ],
          { align: 'center' },
        ),
      };
    }
  }

  if (
    childMap[subjectKey] &&
    childMap[predicateKey] &&
    childMap[subordinateClauseKey]
  ) {
    const decoratorDrawUnit = drawClauseDecorator();
    const subordinateClauseDrawUnit = (
      childMap[subordinateClauseKey] as GraphicalNode
    ).drawUnit;

    return {
      ...node,
      drawUnit: horizontalMerge(
        [
          (childMap[predicateKey] as GraphicalNode).drawUnit,
          verticalMerge([decoratorDrawUnit, subordinateClauseDrawUnit], {
            align: 'center',
            // horizontalStart:
            //   subordinateClauseDrawUnit.horizontalCenter -
            //   decoratorDrawUnit.horizontalCenter,
            // horizontalCenter: decoratorDrawUnit.horizontalCenter,
            // horizontalEnd: decoratorDrawUnit.horizontalEnd,
            // verticalStart: decoratorDrawUnit.verticalStart,
            // verticalCenter: decoratorDrawUnit.verticalCenter,
            // verticalEnd: decoratorDrawUnit.verticalEnd,
          }),
          (childMap[subjectKey] as GraphicalNode).drawUnit,
        ],
        { align: 'center' },
      ),
    };
  }

  throw new GrammarError('InvalidStructure', 'Clause has unexpected structure');
}
