import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { prepositionKey } from './keys.js';

import { getChildMap } from './utils.js';

import { drawPreposition } from '../svgDrawer/drawPreposition.js';

export function parsePreposition(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [prepositionKey];

  if (!node.content || !isFragment(node.content) || node.content.fragment !== 'Preposition') {
    throw new Error('Preposition parser requires Preposition Node');
  }

  if (node.children.length !== 1) {
    throw new Error('Invalid Preposition Node: Preposition Node has 1 children');
  }

  const childMap = getChildMap(node.children, validKeys);

  const keysLen = Object.keys(childMap).length;

  if (keysLen === 1 && childMap[prepositionKey]) {
    return {
      ...node,
      drawUnit: drawPreposition(childMap[prepositionKey]),
    };
  }

  throw new GrammarError('InvalidStructure', 'Nominal has unexpected structure');
}
