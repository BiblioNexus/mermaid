import type { GrammarNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { getKeyFromNode } from './keys.js';

export function getChildMap(nodes: GrammarNode[], validKeys: string[]) {
  const childMap: Record<string, GrammarNode> = {};

  const validMap: Record<string, boolean> = {};

  validKeys.forEach((valid) => {
    validMap[valid] = true;
  });

  nodes.forEach((node) => {
    const key = getKeyFromNode(node);

    if (validMap[key] === undefined) {
      throw new GrammarError('InvalidChildren', `Node has invalid children`);
    }

    const exists = childMap[key!];

    if (exists) {
      throw new GrammarError('InvalidStructure', `Node has invalid children`);
    } else {
      childMap[key!] = node;
    }
  });

  return childMap;
}
