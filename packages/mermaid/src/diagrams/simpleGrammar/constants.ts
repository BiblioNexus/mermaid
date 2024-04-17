import type { GrammarNode } from './simpleGrammarTypes.js';

export const emptyWord: GrammarNode = {
  level: 0,
  children: [],
  content: {
    pos: 'noun',
    word: '( )',
    gloss: '',
    description: '',
  },
};

export const spaceWord: GrammarNode = {
  level: 0,
  children: [],
  content: {
    pos: 'noun',
    word: '',
    gloss: '',
    description: '',
  },
};

export const sampleWord: GrammarNode = {
  level: 4,
  children: [],
  content: {
    pos: 'noun',
    word: 'דָּ֘בָ֤ר',
    gloss: 'theme',
    description: '',
  },
};

export const sampleConstructChainNode: GrammarNode = {
  level: 4,
  children: [sampleWord, sampleWord],
  content: {
    fragment: 'ConstructChain',
    description: '',
  },
};
