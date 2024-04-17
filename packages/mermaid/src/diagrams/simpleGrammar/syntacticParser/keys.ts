import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';
import { isFragment, isWord } from '../utils.js';

import { GrammarError } from '../error.js';

export function generateKey(type: string, value: string) {
  return JSON.stringify({
    type,
    value,
  });
}

export function getKeyFromNode(node: GrammarNode | GraphicalNode): string {
  if (isFragment(node.content!)) {
    return JSON.stringify({
      type: 'fragment',
      value: node.content.fragment,
    });
  }

  if (isWord(node.content!)) {
    return JSON.stringify({
      type: 'word',
      value: node.content.pos,
    });
  }

  throw new GrammarError('InvalidNode', 'Invalid Node');
}

export function generateWordKey(value: string) {
  return JSON.stringify({
    type: 'word',
    value,
  });
}

export function generateFragmentKey(value: string) {
  return JSON.stringify({
    type: 'fragment',
    value,
  });
}

export const nounKey = generateWordKey('noun');
export const pronounKey = generateWordKey('pronoun');
export const articleKey = generateWordKey('article');
export const adjectiveKey = generateWordKey('adjective');
export const prepositionKey = generateWordKey('preposition');
export const quantifierKey = generateWordKey('quantifier');
export const verbKey = generateWordKey('verb');
export const verbparticipleKey = generateWordKey('verb-participle');
export const verbinfinitiveKey = generateWordKey('verb-infinitive');
export const adverbKey = generateWordKey('adverb');
export const conjunctionKey = generateWordKey('conjunction');
export const particleKey = generateWordKey('particle');
export const suffixPronounKey = generateWordKey('suffix-pronoun');
export const copulaKey = generateWordKey('copula');

export const casusPendensKey = generateFragmentKey('CasusPendens');
export const appositionKey = generateFragmentKey('Apposition');
export const discourseunitKey = generateFragmentKey('DiscourseUnit');
export const fragmentKey = generateFragmentKey('Fragment');
export const prepositionFragmentKey = generateFragmentKey('Preposition');
export const nominalKey = generateFragmentKey('Nominal');
export const constructchainKey = generateFragmentKey('ConstructChain');
export const adjectivalKey = generateFragmentKey('Adjectival');
export const adverbialKey = generateFragmentKey('Adverbial');
export const clauseKey = generateFragmentKey('Clause');
export const subjectKey = generateFragmentKey('Subject');
export const predicateKey = generateFragmentKey('Predicate');
export const complementKey = generateFragmentKey('Complement');
export const conjunctionFragmentKey = generateFragmentKey('Conjunction');
export const complementClauseKey = generateFragmentKey('ComplementClause');
export const prepositionalPhraseKey = generateFragmentKey('PrepositionalPhrase');
export const objectKey = generateFragmentKey('Object');
export const relativeClauseKey = generateFragmentKey('RelativeClause');
export const relativeParticleKey = generateFragmentKey('RelativeParticle');
export const vocativeKey = generateFragmentKey('Vocative');
export const subordinateClauseKey = generateFragmentKey('SubordinateClause');
export const clauseClusterKey = generateFragmentKey('ClauseCluster');
export const clausalClusterKey = generateFragmentKey('ClausalCluster');
export const relativeKey = generateFragmentKey('Relative');
export const secondObjectKey = generateFragmentKey('SecondObject');
export const clauseclusterKey = generateFragmentKey('Clausecluster');

export const adjectiveCompoundKey = generateFragmentKey('AdjectiveCompound');
export const adjectivalCompoundKey = generateFragmentKey('AdjectivalCompound');
export const adverbCompoundKey = generateFragmentKey('AdverbCompound');
export const adverbialCompoundKey = generateFragmentKey('AdverbialCompound');
export const constructChainCompoundKey = generateFragmentKey('ConstructChainCompound');
export const nominalCompoundKey = generateFragmentKey('NominalCompound');
export const predicateCompoundKey = generateFragmentKey('PredicateCompound');
export const clauseCompoundKey = generateFragmentKey('ClauseCompound');
export const prepositionalPhraseCompoundKey = generateFragmentKey('PrepositionalPhraseCompound');
export const verbParticipleCompoundKey = generateFragmentKey('VerbParticipleCompound');
export const objectCompoundKey = generateFragmentKey('ObjectCompound');

export const adverbialGroupKey = generateFragmentKey('AdverbialGroup');
export const predicateGroupKey = generateFragmentKey('PredicateGroup');
export const adjectivalGroupKey = generateFragmentKey('AdjectivalGroup');
export const verbParticipleGroupKey = generateFragmentKey('VerbParticipleGroup');
export const objectGroupKey = generateFragmentKey('ObjectGroup');
export const PrepositionalPhraseGroupKey = generateFragmentKey('PrepositionalPhraseGroup');
export const verbGroupKey = generateFragmentKey('VerbGroup');
export const relativeClauseGroupKey = generateFragmentKey('RelativeClauseGroup');
export const subjectGroupKey = generateFragmentKey('SubjectGroup');
export const complementGroupKey = generateFragmentKey('ComplementGroup');
export const nominalGroupKey = generateFragmentKey('NominalGroup');

export const errorKey = generateFragmentKey('Error');
