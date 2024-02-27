import { isFragment, isWord } from '../utils.js';
import type { GrammarNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

export function getChildMap(nodes: GrammarNode[], validKeys: string[]) {
  const childMap: Record<string, GrammarNode> = {};

  const validMap: Record<string, boolean> = {};

  validKeys.forEach((valid) => {
    validMap[valid] = true;
  });

  nodes.forEach((node) => {
    let key;

    if (isFragment(node.content!)) {
      key = JSON.stringify({
        type: 'fragment',
        value: node.content.fragment,
      });
    }

    if (isWord(node.content!)) {
      key = JSON.stringify({
        type: 'word',
        value: node.content.pos,
      });
    }

    if (validMap[key!] === undefined) {
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
