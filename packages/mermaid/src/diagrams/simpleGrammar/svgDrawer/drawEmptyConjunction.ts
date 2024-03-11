import type { DrawUnit, GrammarNode } from '../simpleGrammarTypes.js';
import { drawConjunction } from './drawConjunction.js';

const emptyWord: GrammarNode = {
  level: 0,
  children: [],
  content: {
    pos: 'conjunction',
    word: '',
    gloss: '',
    description: '',
  },
};

export const drawEmptyConjunction = (height: number): DrawUnit => {
  return drawConjunction(emptyWord, height);
};
