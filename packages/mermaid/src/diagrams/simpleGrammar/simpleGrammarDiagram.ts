import type { DiagramDefinition } from '../../diagram-api/types.js';
// @ts-ignore: JISON doesn't support types
import parser from './parser/simple-grammar.jison';
import { db } from './simpleGrammarDb.js';
import { renderer } from './simpleGrammarRenderer.js';

export const diagram: DiagramDefinition = {
  parser,
  db,
  renderer,
};
