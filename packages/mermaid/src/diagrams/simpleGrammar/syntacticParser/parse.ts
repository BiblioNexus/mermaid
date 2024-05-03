import { isFragment, isWord } from '../utils.js';

import { GrammarError } from '../error.js';

import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawWord } from '../svgDrawer/drawWord.js';
import { drawContainer } from '../svgDrawer/drawContainer.js';
import { drawModifier } from '../svgDrawer/drawModifier.js';

import { horizontalMerge } from '../svgDrawer/utils.js';
import { drawVerbparticipleDecorator } from '../svgDrawer/drawVerbparticipleDecorator.js';

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
  objectGroupKey,
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
  appositionKey,
  verbparticipleKey,
  adverbKey,
  casusPendensKey,
  prepositionalPhraseCompoundKey,
  prepositionKey,
  articleKey,
  quantifierKey,
  adjectiveKey,
  objectCompoundKey,
  PrepositionalPhraseGroupKey,
  verbParticipleCompoundKey,
  adjectivalGroupKey,
  verbGroupKey,
  relativeClauseGroupKey,
  clausalClusterKey,
  subjectGroupKey,
  complementGroupKey,
  nominalGroupKey,
  clauseclusterKey,
  errorKey,
} from './keys.js';

import { settings } from '../settings.js';

import { parseFragment } from './parseFragment.js';
import { parseNominal } from './parseNominal.js';
import { parseAdjectival } from './parseAdjectival.js';
import { parsePrepositionalPhrase } from './parsePrepositionalPhrase.js';
import { parseAdverbial } from './parseAdverbial.js';
import { parseApposition } from './parseApposition.js';
import { parseCasusPendens } from './parseCasusPendens.js';
import { parseClause } from './parseClause.js';
import { parseSubject } from './parseSubject.js';
import { parsePredicate } from './parsePredicate.js';
import { parseComplement } from './parseComplement.js';
import { parseComplementClauseClause } from './parseComplementClause.js';
import { parseObject } from './parseObject.js';
import { parseObjectCompound } from './parseObjectCompound.js';
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

import { mockParser } from './mockParser.js';
import { drawError } from '../svgDrawer/drawError.js';
import { parseConstructChain } from './parseConstructChain.js';
import { parsePrepositionalPhraseCompound } from './parsePrepositionalPhraseCompound.js';
import { parseVerbparticipleCompound } from './parseVerbparticipleCompound.js';
import { parseVerbGroup } from './parseVerbGroup.js';
import { parseObjectGroup } from './parseObjectGroup.js';
import { parseSubjectGroup } from './parseSubjectGroup.js';
import { parseComplementGroup } from './parseComplementGroup.js';
import { parseError } from './parseError.js';

const parserMap: Record<string, (node: GrammarNode) => GraphicalNode> = {
  [discourseunitKey]: parseDiscourseUnit,
  [fragmentKey]: parseFragment,
  [nominalKey]: parseNominal,
  [adjectivalKey]: parseAdjectival,
  [adverbialKey]: parseAdverbial,
  [prepositionKey]: parsePreposition,
  [prepositionFragmentKey]: mockParser,
  [prepositionalPhraseKey]: parsePrepositionalPhrase,
  [prepositionalPhraseCompoundKey]: parsePrepositionalPhraseCompound,
  [appositionKey]: parseApposition,
  [casusPendensKey]: parseCasusPendens,
  [constructchainKey]: parseConstructChain,
  [clauseKey]: parseClause,
  [clauseClusterKey]: parseClauseCluster,
  [subjectKey]: parseSubject,
  [predicateKey]: parsePredicate,
  [complementKey]: parseComplement,
  [complementClauseKey]: parseComplementClauseClause,
  [objectKey]: parseObject,
  [objectCompoundKey]: parseObjectCompound,
  [objectGroupKey]: parseObjectGroup,
  [secondObjectKey]: parseObject,
  [relativeClauseKey]: parseRelativeClause,
  [relativeParticleKey]: parseRelativeParticle,
  [relativeKey]: parseRelative,
  [subordinateClauseKey]: parseSubordinateClause,
  [vocativeKey]: parseVocative,
  [conjunctionFragmentKey]: parseConjunction,
  [adjectiveCompoundKey]: parseAdjectiveCompound,
  [adjectivalGroupKey]: parseAdjectiveCompound,
  [adjectivalGroupKey]: parseAdjectiveCompound,
  [adverbCompoundKey]: parseAdverbCompound,
  [adverbialCompoundKey]: parseAdverbialCompound,
  [adverbialGroupKey]: parseAdverbialGroup,
  [clauseCompoundKey]: parseClauseCompound,
  [constructChainCompoundKey]: parseConstructChainCompound,
  [nominalCompoundKey]: parseNominalCompound,
  [predicateCompoundKey]: parsePredicateCompound,
  [predicateGroupKey]: parsePredicateGroup,
  [PrepositionalPhraseGroupKey]: parsePrepositionalPhraseCompound,
  [verbParticipleCompoundKey]: parseVerbparticipleCompound,
  [verbGroupKey]: parseVerbGroup,
  [relativeClauseGroupKey]: parseAdjectiveCompound,
  [clausalClusterKey]: parseClauseCompound,
  [subjectGroupKey]: parseSubjectGroup,
  [complementGroupKey]: parseComplementGroup,
  [nominalGroupKey]: parseNominalCompound,
  [clauseclusterKey]: parseClauseCluster,
  [errorKey]: parseError,
};

export function parse(node: GrammarNode): GraphicalNode {
  try {
    for (let i = 0; i < node.children.length; i++) {
      if (
        node.content &&
        node.children[i].content &&
        getKeyFromNode(node) === adjectivalKey &&
        getKeyFromNode(node.children[i]) === nominalKey
      ) {
        node.children[i] = parse({
          ...node.children[i],
          content: {
            ...node.children[i].content,
            message: 'adjectival > nominal',
          },
        } as GrammarNode);
      } else {
        node.children[i] = parse(node.children[i]);
      }
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
        try {
          return parserMap[key](node);
        } catch (err) {
          return {
            ...node,
            drawUnit: drawError(
              node.content.fragment,
              (err as GrammarError).errorType,
            ),
          };
        }
      } else {
        throw new GrammarError(
          'InvalidStructure',
          'Invalid structure, not defined parser',
        );
      }
    }

    if (isWord(node.content)) {
      if (getKeyFromNode(node) === verbparticipleKey) {
        const drawUnit = drawWord(node, { status: node.status });

        return {
          ...node,
          drawUnit: horizontalMerge(
            [drawUnit, drawVerbparticipleDecorator(node.status)],
            {
              align: ['end', 'end'],
              verticalStart: drawUnit.verticalStart,
              verticalCenter: drawUnit.verticalCenter,
              verticalEnd: drawUnit.verticalEnd,
            },
          ),
        };
      }

      if (
        [adverbKey, adjectiveKey, articleKey, quantifierKey].includes(
          getKeyFromNode(node),
        )
      ) {
        return {
          ...node,
          drawUnit: drawModifier(node, node.status),
        };
      }

      return {
        ...node,
        drawUnit: drawWord(node, { status: node.status, withLine: true }),
      };
    }

    throw new GrammarError(
      'InvalidStructure',
      'Invalid structure, not defined parser',
    );
  } catch (err) {
    return {
      ...node,
      drawUnit: drawError('Parse', (err as GrammarError).errorType),
    };
  }
}
