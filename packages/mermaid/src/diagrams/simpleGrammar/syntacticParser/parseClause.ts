import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type {
  DrawUnit,
  GrammarNode,
  GraphicalNode,
} from '../simpleGrammarTypes.js';

import {
  subjectKey,
  predicateKey,
  vocativeKey,
  subordinateClauseKey,
  complementKey,
  clauseKey,
  nominalKey,
  objectKey,
  secondObjectKey,
  verbKey,
  predicateGroupKey,
  subjectGroupKey,
} from './keys.js';

import { getChildMap, havingGivenKeys } from './utils.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawClauseDecorator } from '../svgDrawer/drawClauseDecorator.js';
import { drawComplementDecorator } from '../svgDrawer/drawComplementDecorator.js';
import { drawVerticalLine } from '../svgDrawer/drawVerticalLine.js';
import { drawSpacer } from '../svgDrawer/drawSpacer.js';
import { drawWord } from '../svgDrawer/drawWord.js';

export function parseClause(node: GrammarNode): GraphicalNode {
  const ignoreKeys = [clauseKey, nominalKey];
  const specialKeys = [
    complementKey,
    verbKey,
    objectKey,
    secondObjectKey,
    predicateKey,
    predicateGroupKey,
    subordinateClauseKey,
    subjectKey,
    subjectGroupKey,
    vocativeKey,
  ];

  const validKeys: string[] = [...ignoreKeys, ...specialKeys];

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

  const childMap = getChildMap(node.children, validKeys);

  if (havingGivenKeys(node.children, ignoreKeys)) {
    return {
      ...node,
      drawUnit: drawClauseDecorator({ status: node.status }),
    };
  }

  const elements: DrawUnit[] = [];

  if (childMap[complementKey]) {
    elements.push(
      horizontalMerge(
        [
          childMap[complementKey].drawUnit,
          drawComplementDecorator(node.status),
        ],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[secondObjectKey]) {
    elements.push(
      horizontalMerge(
        [childMap[secondObjectKey].drawUnit, drawVerticalLine(node.status)],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[objectKey]) {
    elements.push(
      horizontalMerge(
        [childMap[objectKey].drawUnit, drawVerticalLine(node.status)],
        {
          align: ['center', 'end'],
        },
      ),
    );
  }

  if (childMap[predicateKey]) {
    elements.push(childMap[predicateKey].drawUnit);
  }

  if (childMap[predicateGroupKey]) {
    elements.push(childMap[predicateGroupKey].drawUnit);
  }

  if (childMap[verbKey]) {
    elements.push(
      drawWord(childMap[verbKey], {
        withLine: true,
        status: node.status,
      }),
    );
  }

  elements.push(
    drawClauseDecorator({
      drawUnit: childMap[subordinateClauseKey]?.drawUnit || undefined,
      status: node.status,
    }),
  );

  if (childMap[subjectKey]) {
    elements.push(childMap[subjectKey].drawUnit);
  }

  if (childMap[subjectGroupKey]) {
    elements.push(childMap[subjectGroupKey].drawUnit);
  }

  if (childMap[vocativeKey]) {
    elements.push(...[drawSpacer(), childMap[vocativeKey].drawUnit]);
  }

  return {
    ...node,
    drawUnit: horizontalMerge(elements, { align: 'center' }),
  };
}
