import type { DrawUnit, GrammarNode } from '../simpleGrammarTypes.js';
import { drawClauseConjunction } from './drawClauseConjunction.js';

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

export const drawEmptyClauseConjunction = (height: number): DrawUnit => {
  return drawClauseConjunction(emptyWord, height);
};
