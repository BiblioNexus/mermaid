import type { GrammarNode } from '../simpleGrammarTypes.js';

import {
  adjectivalCompoundKey,
  adjectivalKey,
  adjectiveCompoundKey,
  adjectiveKey,
  adverbCompoundKey,
  adverbKey,
  adverbialCompoundKey,
  adverbialKey,
  appositionKey,
  clausalClusterKey,
  clauseClusterKey,
  clauseCompoundKey,
  clauseKey,
  complementClauseKey,
  complementKey,
  conjunctionFragmentKey,
  conjunctionKey,
  constructChainCompoundKey,
  constructchainKey,
  getKeyFromNode,
  nominalCompoundKey,
  nominalKey,
  nounKey,
  objectCompoundKey,
  objectKey,
  predicateCompoundKey,
  predicateKey,
  prepositionKey,
  prepositionalPhraseCompoundKey,
  prepositionalPhraseKey,
  pronounKey,
  relativeClauseKey,
  subjectKey,
  subordinateClauseKey,
  verbKey,
  verbparticipleKey,
} from './keys.js';
import { isFragment } from '../utils.js';
import { allGivenKeys, havingGivenKeys } from './utils.js';

export type CompoundType =
  | 'AdjectiveCompound'
  | 'AdverbCompound'
  | 'AdverbialCompound'
  | 'ConstructChainCompound'
  | 'NominalCompound'
  | 'PredicateCompound'
  | 'ClauseCompound'
  | 'PrepositionalPhraseCompound'
  | 'VerbParticipleCompound'
  | 'ObjectCompound'
  | 'AdjectivalCompound';

export type GroupType =
  | 'AdverbialGroup'
  | 'AdjectivalGroup'
  | 'PredicateGroup'
  | 'AdjectiveGroup'
  | 'VerbParticipleGroup'
  | 'ObjectGroup'
  | 'VerbGroup'
  | 'RelativeClauseGroup'
  | 'SubjectGroup';

function isCompound(compoundType: CompoundType, nodes: GrammarNode[]) {
  const requiredKeys: Record<CompoundType, string[]> = {
    AdjectiveCompound: [adjectiveKey],
    AdverbCompound: [adverbKey],
    AdverbialCompound: [adverbialKey],
    AdjectivalCompound: [adjectivalKey],
    ConstructChainCompound: [constructchainKey],
    NominalCompound: [nounKey, pronounKey, nominalKey],
    PredicateCompound: [predicateKey, verbKey],
    ClauseCompound: [clauseKey, clauseClusterKey, clausalClusterKey],
    PrepositionalPhraseCompound: [prepositionalPhraseKey],
    VerbParticipleCompound: [verbparticipleKey],
    ObjectCompound: [objectKey],
  };
  const additionalKeys: Record<CompoundType, (string | null)[]> = {
    AdjectiveCompound: [null],
    AdverbCompound: [null],
    AdverbialCompound: [adverbKey, null],
    AdjectivalCompound: [adjectiveKey, null],
    ConstructChainCompound: [nounKey, nominalKey, appositionKey],
    NominalCompound: [appositionKey],
    PredicateCompound: [objectKey],
    ClauseCompound: [null],
    PrepositionalPhraseCompound: [null],
    VerbParticipleCompound: [adjectiveKey],
    ObjectCompound: [null],
  };

  const validKeys = [
    ...requiredKeys[compoundType],
    ...additionalKeys[compoundType],
    conjunctionFragmentKey,
    conjunctionKey,
  ];

  const hasRequiredKeys = havingGivenKeys(nodes, requiredKeys[compoundType]);

  const hasValidKey = allGivenKeys(
    nodes,
    validKeys.filter((value) => !!value) as string[],
  );

  return hasRequiredKeys && hasValidKey;
}

export function generateNewCompoundFragment(nodes: GrammarNode[]): GrammarNode {
  const children = nodes;

  const compoundTypes: CompoundType[] = [
    'VerbParticipleCompound',
    'AdjectiveCompound',
    'AdverbialCompound',
    'AdverbCompound',
    'ConstructChainCompound',
    'NominalCompound',
    'PredicateCompound',
    'ClauseCompound',
    'PrepositionalPhraseCompound',
    'ObjectCompound',
  ];

  for (const compoundType of compoundTypes) {
    if (isCompound(compoundType, children)) {
      return {
        level: 0,
        children,
        content: {
          fragment: compoundType,
          description: '',
        },
      };
    }
  }

  return {
    level: 0,
    children,
    content: {
      fragment: 'Error',
      description: 'Invalid structure',
    },
  };
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

  let groupNumber = 0;
  const flag = [];

  for (let i = 0; i < node.children.length; i++) {
    flag.push(-1);
  }

  for (let i = 0; i < node.children.length; i++) {
    if (
      getKeyFromNode(node.children[i]) === conjunctionFragmentKey ||
      getKeyFromNode(node.children[i]) === conjunctionKey
    ) {
      if (i === 0 || flag[i - 1] === -1) {
        groupNumber += 1;
        flag[i - 1] = groupNumber;
      }

      flag[i] = groupNumber;
      flag[i + 1] = groupNumber;
    }
  }

  const newChildren: GrammarNode[] = [];
  let groupNodes: GrammarNode[] = [];

  for (let i = 0; i < node.children.length; i++) {
    if (flag[i] === -1) {
      if (groupNodes.length > 0) {
        if (
          allGivenKeys(groupNodes, [conjunctionFragmentKey, conjunctionKey])
        ) {
          newChildren.push(...groupNodes);
        } else {
          newChildren.push(generateNewCompoundFragment(groupNodes));
        }

        groupNodes = [];
      }

      newChildren.push(node.children[i]);
    } else {
      groupNodes.push(node.children[i]);
    }
  }

  if (groupNodes.length > 0) {
    if (allGivenKeys(groupNodes, [conjunctionFragmentKey, conjunctionKey])) {
      newChildren.push(...groupNodes);
    } else {
      newChildren.push(generateNewCompoundFragment(groupNodes));
    }

    groupNodes = [];
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
    prepositionKey,
    appositionKey,
    constructchainKey,
    conjunctionFragmentKey,
    adjectiveCompoundKey,
    adverbCompoundKey,
    adverbialCompoundKey,
    constructChainCompoundKey,
    nominalCompoundKey,
    predicateCompoundKey,
    clauseCompoundKey,
    objectCompoundKey,
    prepositionalPhraseCompoundKey,
  ];

  if (skipKeys.includes(getKeyFromNode(node))) {
    return node;
  }

  const keyMap = {
    AdverbialGroup: [adverbialKey, adverbKey, adverbialCompoundKey],
    AdjectivalGroup: [adjectivalKey, adjectivalCompoundKey],
    PredicateGroup: [predicateKey, predicateCompoundKey],
    ClauseCluster: [clauseKey, clauseCompoundKey],
    PrepositionalPhraseGroup: [prepositionalPhraseKey],
    ObjectGroup: [objectKey],
    VerbGroup: [verbKey],
    RelativeClauseGroup: [relativeClauseKey],
    SubjectGroup: [subjectKey],
    ComplementGroup: [complementKey],
    NominalGroup: [nominalKey],
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
  const exceptionKeys: string[] = [];
  const newChildren: GrammarNode[] = [];

  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].content && isFragment(node.children[i].content!)) {
      if (
        !exceptionKeys.includes(getKeyFromNode(node.children[i])) &&
        node.children[i].children.length === 0
      ) {
        continue;
      }

      newChildren.push(shakingTreeForEmptyFragment(node.children[i]));
    } else {
      newChildren.push(node.children[i]);
    }
  }

  return {
    ...node,
    children: newChildren,
  };
}

export function shakingTree(root: GrammarNode): GrammarNode {
  return shakingTreeForDuplication(
    shakingTreeForConjunction(shakingTreeForEmptyFragment(root)),
  );
}
