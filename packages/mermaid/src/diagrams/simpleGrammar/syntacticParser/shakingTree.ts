import type { GrammarNode } from '../simpleGrammarTypes.js';

import { GrammarError } from '../error.js';

import {
  adjectiveCompoundKey,
  adjectiveKey,
  adverbCompoundKey,
  adverbKey,
  adverbialCompoundKey,
  adverbialKey,
  clauseClusterKey,
  clauseCompoundKey,
  clauseKey,
  complementClauseKey,
  conjunctionFragmentKey,
  conjunctionKey,
  constructChainCompoundKey,
  constructchainKey,
  getKeyFromNode,
  nominalCompoundKey,
  nominalKey,
  nounKey,
  predicateCompoundKey,
  predicateKey,
  subordinateClauseKey,
  verbparticipleKey,
} from './keys.js';

export type CompoundType =
  | 'AdjectiveCompound'
  | 'AdverbCompound'
  | 'AdverbialCompound'
  | 'ConstructChainCompound'
  | 'NominalCompound'
  | 'PredicateCompound'
  | 'ClauseCompound';

export type GroupType = 'AdverbialGroup' | 'PredicateGroup';

function isCompound(
  compoundType: CompoundType,
  leftKey: string | null,
  rightKey: string | null,
) {
  const requiredKeys: Record<CompoundType, (string | null)[]> = {
    AdjectiveCompound: [adjectiveKey, adjectiveCompoundKey],
    AdverbCompound: [adverbKey, adverbCompoundKey],
    AdverbialCompound: [adverbialKey, adverbKey],
    ConstructChainCompound: [constructchainKey, constructChainCompoundKey],
    NominalCompound: [nounKey, nominalKey, nominalCompoundKey],
    PredicateCompound: [predicateKey, predicateCompoundKey],
    ClauseCompound: [clauseKey, clauseClusterKey, clauseCompoundKey],
  };
  const additionalKeys: Record<CompoundType, (string | null)[]> = {
    AdjectiveCompound: [verbparticipleKey],
    AdverbCompound: [null],
    AdverbialCompound: [adverbKey, adverbCompoundKey, null],
    ConstructChainCompound: [nounKey, nominalKey],
    NominalCompound: [null],
    PredicateCompound: [null],
    ClauseCompound: [null],
  };

  const validKeys = [
    ...requiredKeys[compoundType],
    ...additionalKeys[compoundType],
  ];

  const hasRequiredKeys =
    requiredKeys[compoundType].includes(leftKey) ||
    requiredKeys[compoundType].includes(rightKey);

  const hasValidKey =
    validKeys.includes(leftKey) && validKeys.includes(rightKey);

  if (compoundType === 'AdverbialCompound') {
    return (
      (leftKey === adverbKey && rightKey === adverbialKey) ||
      (leftKey === adverbialKey && rightKey === adverbKey)
    );
  }

  return hasRequiredKeys && hasValidKey;
}

export function generateNewCompoundFragment(
  conjunction: GrammarNode,
  leftNode: GrammarNode | null,
  rightNode: GrammarNode | null,
): GrammarNode {
  const leftKey = leftNode ? getKeyFromNode(leftNode) : null;
  const rightKey = rightNode ? getKeyFromNode(rightNode) : null;

  if (!leftNode && !rightNode) {
    return conjunction;
  }

  const children = [conjunction, leftNode, rightNode].filter(
    (node) => !!node,
  ) as GrammarNode[];

  const compoundTypes: CompoundType[] = [
    'AdjectiveCompound',
    'AdverbCompound',
    'AdverbialCompound',
    'ConstructChainCompound',
    'NominalCompound',
    'PredicateCompound',
    'ClauseCompound',
  ];

  for (const compoundType of compoundTypes) {
    if (isCompound(compoundType, leftKey, rightKey)) {
      return {
        ...conjunction,
        children,
        content: {
          fragment: compoundType,
          description: '',
        },
      };
    }
  }

  throw new GrammarError('InvalidStructure', `Node has invalid children`);
}

export function shakingTreeForConjunction(node: GrammarNode): GrammarNode {
  for (let i = 0; i < node.children.length; i++) {
    node.children[i] = shakingTreeForConjunction(node.children[i]);
  }

  if (node.content === null) {
    return node;
  }

  const skipKeys = [
    conjunctionFragmentKey,
    subordinateClauseKey,
    complementClauseKey,
  ];

  if (skipKeys.includes(getKeyFromNode(node))) {
    return node;
  }

  const newChildren: GrammarNode[] = [];

  for (let i = 0; i < node.children.length; i++) {
    const conjunctions: GrammarNode[] = [];

    while (
      i < node.children.length &&
      (getKeyFromNode(node.children[i]) === conjunctionFragmentKey ||
        getKeyFromNode(node.children[i]) === conjunctionKey)
    ) {
      conjunctions.push(node.children[i]);
      i++;
    }

    if (conjunctions.length === 1) {
      const conjunction =
        getKeyFromNode(conjunctions[0]) === conjunctionKey
          ? {
              ...conjunctions[0],
              children: [conjunctions[0]],
              content: {
                fragment: 'Conjunction',
                description: '',
              },
            }
          : conjunctions[0];

      const leftNode =
        newChildren.length > 0 ? newChildren[newChildren.length - 1] : null;
      const rightNode = i < node.children.length ? node.children[i] : null;

      if (newChildren.length > 0) {
        newChildren[newChildren.length - 1] = generateNewCompoundFragment(
          conjunction,
          leftNode,
          rightNode,
        );
      } else {
        newChildren.push(
          generateNewCompoundFragment(conjunction, leftNode, rightNode),
        );
      }
    } else if (conjunctions.length === 0) {
      newChildren.push(node.children[i]);
    } else {
      console.log(node);
      throw new GrammarError('InvalidStructure', `Node has invalid children`);
    }
  }

  return {
    ...node,
    children: newChildren,
  };
}

export function shakingTreeForDuplication(node: GrammarNode): GrammarNode {
  for (let i = 0; i < node.children.length; i++) {
    node.children[i] = shakingTreeForDuplication(node.children[i]);
  }

  if (node.content === null) {
    return node;
  }

  const skipKeys = [
    constructchainKey,
    conjunctionFragmentKey,
    adjectiveCompoundKey,
    adverbCompoundKey,
    adverbialCompoundKey,
    constructChainCompoundKey,
    nominalCompoundKey,
    predicateCompoundKey,
    clauseCompoundKey,
  ];

  if (skipKeys.includes(getKeyFromNode(node))) {
    return node;
  }

  const keyMap = {
    AdverbialGroup: [adverbialKey, adverbialCompoundKey],
    PredicateGroup: [predicateKey, predicateCompoundKey],
    ClauseCluster: [clauseKey, clauseCompoundKey],
  };

  const duplicatibleKeys = Object.values(keyMap).reduce(
    (acc, item) => [...acc, ...item],
    [],
  );

  const newChildren: GrammarNode[] = node.children.filter(
    (child) => !duplicatibleKeys.includes(getKeyFromNode(child)),
  );

  Object.keys(keyMap).forEach((groupType) => {
    const children = node.children.filter((child) =>
      keyMap[groupType as keyof typeof keyMap].includes(getKeyFromNode(child)),
    );

    if (children.length > 1) {
      newChildren.push({
        level: 0,
        children,
        content: {
          fragment: groupType,
          description: '',
        },
      });
    } else if (children.length === 1) {
      newChildren.push(children[0]);
    }
  });

  return {
    ...node,
    children: newChildren,
  };
}

export function shakingTreeForEmptyFragment(node: GrammarNode): GrammarNode {
  const deletionKeys = [predicateKey];
  const newChildren: GrammarNode[] = [];

  for (let i = 0; i < node.children.length; i++) {
    if (
      deletionKeys.includes(getKeyFromNode(node.children[i])) &&
      node.children[i].children.length === 0
    ) {
      continue;
    }

    newChildren.push(shakingTreeForEmptyFragment(node.children[i]));
  }

  return {
    ...node,
    children: newChildren,
  };
}

export function shakingTree(node: GrammarNode): GrammarNode {
  return shakingTreeForDuplication(
    shakingTreeForConjunction(shakingTreeForEmptyFragment(node)),
  );
}
