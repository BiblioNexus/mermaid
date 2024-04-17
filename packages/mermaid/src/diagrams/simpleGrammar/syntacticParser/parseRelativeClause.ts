import { isFragment } from '../utils.js';
import { GrammarError } from '../error.js';
import type {
  GrammarNode,
  GraphicalNode,
  DrawUnit,
} from '../simpleGrammarTypes.js';

import {
  relativeParticleKey,
  clauseKey,
  clauseClusterKey,
  relativeKey,
} from './keys.js';

import { getChildMap } from './utils.js';

import { drawRelativeParticle } from '../svgDrawer/drawRelativeParticle.js';

export function parseRelativeClause(node: GrammarNode): GraphicalNode {
  const validKeys: string[] = [
    relativeKey,
    relativeParticleKey,
    clauseKey,
    clauseClusterKey,
  ];

  if (
    !node.content ||
    !isFragment(node.content) ||
    node.content.fragment !== 'RelativeClause'
  ) {
    throw new GrammarError(
      'InvalidParser',
      'RelativeClause parser requires RelativeClause Node',
    );
  }

  if (node.children.length === 0) {
    throw new GrammarError(
      'InvalidStructure',
      'RelativeClause has no children',
    );
  }

  const childMap = getChildMap(node.children, validKeys);

  let particleNode: GrammarNode | undefined = undefined;

  if (childMap[relativeParticleKey]) {
    particleNode = childMap[relativeParticleKey].children[0];
  }

  if (childMap[relativeKey]) {
    particleNode = childMap[relativeKey].children[0];
  }

  let drawUnit: DrawUnit | undefined = undefined;

  if (childMap[clauseKey]) {
    drawUnit = childMap[clauseKey].drawUnit;
  }

  if (childMap[clauseClusterKey]) {
    drawUnit = childMap[clauseClusterKey].drawUnit;
  }

  if (drawUnit === undefined || particleNode === undefined) {
    throw new GrammarError(
      'InvalidStructure',
      'RelativeClause has unexpected structure',
    );
  }

  return {
    ...node,
    drawUnit: drawRelativeParticle(particleNode, drawUnit),
  };
}
