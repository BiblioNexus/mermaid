import type { DiagramDB } from '../../diagram-api/types.js';
import type { log } from '../../logger.js';
import type { D3Element } from '../../mermaidAPI.js';

export type DrawUnit = {
  width: number;
  height: number;
  element: D3Element;
  verticalStart: number;
  verticalCenter: number;
  verticalEnd: number;
  horizontalStart: number;
  horizontalCenter: number;
  horizontalEnd: number;
};

export type Word = {
  pos: string;
  word: string;
  gloss: string;
  description: string;
  arguments: string;
};

export type Fragment = {
  fragment: string;
  description: string;
  arguments: string;
};

export type GrammarNode = {
  level: number;
  parent?: GrammarNode;
  children: (GrammarNode | GraphicalNode)[];
  content: Word | Fragment | null;
};

export type GraphicalNode = GrammarNode & {
  drawUnit: DrawUnit;
};

export interface SimpleGrammarDB extends DiagramDB {
  getLogger: () => typeof log;
  clear: () => void;
  getSimpleGrammar: () => GrammarNode;
  addWord: (level: number, pos: string, str: string, description: string) => void;
  addFragment: (level: number, fragment: string, description: string) => void;
  addNewLine: (level: number, line: string) => void;
}
