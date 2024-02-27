import { drawWord } from './drawWord.js';

import type { DrawUnit, GrammarNode } from '../simpleGrammarTypes.js';

const emptyWord: GrammarNode = {
  level: 0,
  children: [],
  content: {
    pos: 'noun',
    word: '( )',
    gloss: '',
    description: '',
  },
};

export const drawEmptyWord = (): DrawUnit => {
  return drawWord(emptyWord);
};
