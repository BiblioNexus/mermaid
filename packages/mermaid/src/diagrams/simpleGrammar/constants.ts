import type { GrammarNode } from './simpleGrammarTypes.js';

export const emptyWord: GrammarNode = {
  level: 0,
  children: [],
  content: {
    pos: 'noun',
    word: '( )',
    gloss: '',
    description: '',
    arguments: '',
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
    arguments: '',
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
    arguments: '',
  },
};

export const sampleConstructChainNode: GrammarNode = {
  level: 4,
  children: [sampleWord, sampleWord],
  content: {
    fragment: 'ConstructChain',
    description: '',
    arguments: '',
  },
};
