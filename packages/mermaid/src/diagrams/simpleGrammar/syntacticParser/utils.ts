import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import { conjunctionFragmentKey, conjunctionKey, getKeyFromNode } from './keys.js';
import { isGraphicalNode } from '../utils.js';

export function getChildMap(nodes: GrammarNode[], validKeys: string[]) {
  const childMap: Record<string, GraphicalNode> = {};

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
      throw new GrammarError('InvalidStructure', `Node has duplicated children`);
    } else {
      if (isGraphicalNode(node)) {
        childMap[key!] = node;
      } else {
        throw new GrammarError('InvalidStructure', 'Node has invalid structure');
      }
    }
  });

  return childMap;
}

export function havingGivenKeys(nodes: GrammarNode[], keys: string[]): boolean {
  for (const node of nodes) {
    if (keys.includes(getKeyFromNode(node))) {
      return true;
    }
  }

  return false;
}

export function allGivenKeys(nodes: GrammarNode[], keys: string[]): boolean {
  for (const node of nodes) {
    if (!keys.includes(getKeyFromNode(node))) {
      return false;
    }
  }

  return true;
}

export function isConjunction(node: GrammarNode): boolean {
  return getKeyFromNode(node) === conjunctionKey || getKeyFromNode(node) === conjunctionFragmentKey;
}
