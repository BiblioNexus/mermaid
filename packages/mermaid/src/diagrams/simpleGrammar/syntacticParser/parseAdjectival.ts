import { isFragment } from '../utils.js';
import { ErrorType, GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { clauseKey, nominalKey, prepositionalPhraseKey, verbparticipleKey } from './keys.js';

import { getChildMap } from './utils.js';

import { herizontalMerge } from '../svgDrawer/utils.js';
import { drawAdjectivalDecorator } from '../svgDrawer/drawAdjectivalDecorator.js';
import { drawAdjectivalClauseDecorator } from '../svgDrawer/drawAdjectivalClauseDecorator.js';

export function parseAdjectival(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [verbparticipleKey, nominalKey, clauseKey, prepositionalPhraseKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Adjectival') {
    throw new GrammarError(ErrorType.InvalidParser, 'Adjectival parser requires Adjectival Node');
  }

  if (node.children.length === 0) {
    throw new GrammarError(ErrorType.InvalidStructure, 'Adjectival has no children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1) {
    if (childMap[verbparticipleKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [(childMap[verbparticipleKey] as GraphicalNode).drawUnit, drawAdjectivalDecorator()],
          { align: 'end' }
        ),
      };
    }

    if (childMap[nominalKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [(childMap[nominalKey] as GraphicalNode).drawUnit, drawAdjectivalDecorator()],
          { align: 'start' }
        ),
      };
    }

    if (childMap[prepositionalPhraseKey]) {
      return {
        ...node,
        drawUnit: (childMap[prepositionalPhraseKey] as GraphicalNode).drawUnit,
      };
    }

    if (childMap[clauseKey]) {
      return {
        ...node,
        drawUnit: herizontalMerge(
          [(childMap[clauseKey] as GraphicalNode).drawUnit, drawAdjectivalClauseDecorator()],
          { align: 'center' }
        ),
      };
    }
  }

  throw new GrammarError(ErrorType.InvalidStructure, 'Adjectival has unexpected structure');
}
