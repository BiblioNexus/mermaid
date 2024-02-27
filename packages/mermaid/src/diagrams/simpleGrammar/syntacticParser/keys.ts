export function generateKey(type: string, value: string) {
  return JSON.stringify({
    type,
    value,
  });
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
export const prepositionalPhraseKey = generateFragmentKey(
  'PrepositionalPhrase',
);
export const objectKey = generateFragmentKey('Object');
export const relativeClauseKey = generateFragmentKey('RelativeClause');
export const relativeParticleKey = generateFragmentKey('RelativeParticle');
export const vocativeKey = generateFragmentKey('Vocative');
export const subordinateClauseKey = generateFragmentKey('SubordinateClause');
export const clauseClusterKey = generateFragmentKey('ClauseCluster');
export const relativeKey = generateFragmentKey('Relative');
export const secondObjectKey = generateFragmentKey('SecondObject');
