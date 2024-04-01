import { isFragment, isWord } from '../utils.js';

import { GrammarError } from '../error.js';

import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawWord } from '../svgDrawer/drawWord.js';
import { drawVerbInifinitiveDecorator } from '../svgDrawer/drawVerbInifinitiveDecorator.js';
import { drawContainer } from '../svgDrawer/drawContainer.js';

import { horizontalMerge } from '../svgDrawer/utils.js';

import {
  adjectivalKey,
  adverbialKey,
  clauseKey,
  complementClauseKey,
  complementKey,
  constructchainKey,
  discourseunitKey,
  fragmentKey,
  generateFragmentKey,
  nominalKey,
  objectKey,
  predicateKey,
  prepositionFragmentKey,
  prepositionalPhraseKey,
  relativeClauseKey,
  relativeParticleKey,
  relativeKey,
  subjectKey,
  subordinateClauseKey,
  secondObjectKey,
  vocativeKey,
  adjectiveCompoundKey,
  adverbCompoundKey,
  adverbialCompoundKey,
  adverbialGroupKey,
  clauseCompoundKey,
  constructChainCompoundKey,
  nominalCompoundKey,
  predicateCompoundKey,
  predicateGroupKey,
  conjunctionFragmentKey,
  clauseClusterKey,
  getKeyFromNode,
  verbinfinitiveKey,
  appositionKey,
  verbparticipleKey,
  adverbKey,
  casusPendensKey,
} from './keys.js';

import { settings } from '../settings.js';

import { parseConstructChain } from './parseConstructChain.js';
import { parseAdjectival } from './parseAdjectival.js';
import { parseFragment } from './parseFragment.js';
import { parseNominal } from './parseNominal.js';
import { parsePrepositionalPhrase } from './parsePrepositionalPhrase.js';
import { parseAdverbial } from './parseAdverbial.js';
import { parseClause } from './parseClause.js';
import { parseSubject } from './parseSubject.js';
import { parsePredicate } from './parsePredicate.js';
import { parseComplement } from './parseComplement.js';
import { parseComplementClauseClause } from './parseComplementClause.js';
import { parseObject } from './parseObject.js';
import { parseRelativeClause } from './parseRelativeClause.js';
import { parseSubordinateClause } from './parseSubordinateClause.js';
import { parseRelative } from './parseRelative.js';
import { parseDiscourseUnit } from './parseDiscourseUnit.js';
import { parseRelativeParticle } from './parseRelativeParticle.js';
import { parsePreposition } from './parsePreposition.js';
import { parseVocative } from './parseVocative.js';
import { parseAdjectiveCompound } from './parseAdjectiveCompound.js';
import { parseAdverbCompound } from './parseAdverbCompound.js';
import { parseAdverbialCompound } from './parseAdverbialCompound.js';
import { parseAdverbialGroup } from './parseAdverbialGroup.js';
import { parseClauseCompound } from './parseClauseCompound.js';
import { parseConstructChainCompound } from './parseConstructChainCompound.js';
import { parseNominalCompound } from './parseNominalCompound.js';
import { parsePredicateCompound } from './parsePredicateCompound.js';
import { parsePredicateGroup } from './parsePredicateGroup.js';
import { parseConjunction } from './parseConjunction.js';
import { parseClauseCluster } from './parseClauseCluster.js';
import { parseApposition } from './parseApposition.js';
import { drawVerbparticipleDecorator } from '~/svgDrawer/drawVerbparticipleDecorator.js';
import { drawModifier } from '~/svgDrawer/drawModifier.js';
import { parseCasusPendens } from './parseCasusPendens.js';

const parserMap: Record<string, (node: GrammarNode) => GraphicalNode> = {
  [discourseunitKey]: parseDiscourseUnit,
  [fragmentKey]: parseFragment,
  [prepositionFragmentKey]: parsePreposition,
  [nominalKey]: parseNominal,
  [constructchainKey]: parseConstructChain,
  [appositionKey]: parseApposition,
  [adjectivalKey]: parseAdjectival,
  [adverbialKey]: parseAdverbial,
  [clauseKey]: parseClause,
  [clauseClusterKey]: parseClauseCluster,
  [subjectKey]: parseSubject,
  [predicateKey]: parsePredicate,
  [complementKey]: parseComplement,
  [complementClauseKey]: parseComplementClauseClause,
  [prepositionalPhraseKey]: parsePrepositionalPhrase,
  [objectKey]: parseObject,
  [secondObjectKey]: parseObject,
  [relativeClauseKey]: parseRelativeClause,
  [relativeParticleKey]: parseRelativeParticle,
  [relativeKey]: parseRelative,
  [subordinateClauseKey]: parseSubordinateClause,
  [vocativeKey]: parseVocative,
  [casusPendensKey]: parseCasusPendens,
  [conjunctionFragmentKey]: parseConjunction,
  [adjectiveCompoundKey]: parseAdjectiveCompound,
  [adverbCompoundKey]: parseAdverbCompound,
  [adverbialCompoundKey]: parseAdverbialCompound,
  [adverbialGroupKey]: parseAdverbialGroup,
  [clauseCompoundKey]: parseClauseCompound,
  [constructChainCompoundKey]: parseConstructChainCompound,
  [nominalCompoundKey]: parseNominalCompound,
  [predicateCompoundKey]: parsePredicateCompound,
  [predicateGroupKey]: parsePredicateGroup,
};

export function parse(node: GrammarNode): GraphicalNode {
  for (let i = 0; i < node.children.length; i++) {
    node.children[i] = parse(node.children[i]);
  }

  if (node.content === null) {
    return {
      ...node,
      drawUnit: drawContainer(
        node,
        'Simple Grammar',
        settings.titleColor,
        settings.wordStrokeColor,
      ),
    };
  }

  if (isFragment(node.content)) {
    const key = generateFragmentKey(node.content.fragment);

    if (parserMap[key]) {
      return parserMap[key](node);
    } else {
      console.log(key);
      console.log(node);
      throw new GrammarError(
        'InvalidStructure',
        'Invalid structure, not defined parser',
      );
    }
  }

  if (isWord(node.content)) {
    if (getKeyFromNode(node) === verbinfinitiveKey) {
      const drawUnit = drawWord(node);

      return {
        ...node,
        drawUnit: horizontalMerge([drawUnit, drawVerbInifinitiveDecorator()], {
          align: ['end', 'center'],
          verticalStart: drawUnit.verticalStart,
          verticalCenter: drawUnit.verticalCenter,
          verticalEnd: drawUnit.verticalEnd,
        }),
      };
    }

    if (getKeyFromNode(node) === verbparticipleKey) {
      const drawUnit = drawWord(node);

      return {
        ...node,
        drawUnit: horizontalMerge([drawUnit, drawVerbparticipleDecorator()], {
          align: ['end', 'end'],
          verticalStart: drawUnit.verticalStart,
          verticalCenter: drawUnit.verticalCenter,
          verticalEnd: drawUnit.verticalEnd,
        }),
      };
    }

    if (getKeyFromNode(node) === adverbKey) {
      return {
        ...node,
        drawUnit: drawModifier(node),
      };
    }

    return {
      ...node,
      drawUnit: drawWord(node),
    };
  }

  throw new GrammarError(
    'InvalidStructure',
    'Invalid structure, not defined parser',
  );
}
