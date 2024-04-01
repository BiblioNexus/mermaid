import { log } from '../../logger.js';

import type { SimpleGrammarDB, Fragment, Word, GrammarNode } from './simpleGrammarTypes.js';

const rootNode: GrammarNode = {
  level: -1,
  children: [],
  content: null,
};

let lastAdded = rootNode;

const fragments: Record<string, string> = {};
const words: Record<string, string> = {};

const getLogger = () => log;

const clear = () => {
  rootNode.level = -1;
  rootNode.children = [];
  rootNode.content = null;

  lastAdded = rootNode;
};

clear();

const getParent = (level: number): GrammarNode | undefined => {
  let current: GrammarNode | undefined = lastAdded;

  while (current && current.level >= level) {
    current = current.parent;
  }

  if (current && current.content && isWord(current.content)) {
    current = getParent(current.level);
  }

  return current;
};

const getHebrewText = (str: string) => {
  let i = 0;

  for (; i < str.length; i++) {
    const code = str.charCodeAt(i);

    if (code >= 0x0590 && code <= 0x05ff) {
      break;
    }
  }

  if (i >= str.length) {
    return '';
  }

  let j = i + 1;

  for (; j < str.length; j++) {
    const code = str.charCodeAt(j);

    if ((code < 0x0590 || code > 0x05ff) && str[i] !== ' ') {
      break;
    }
  }

  return str.slice(i, j);
};

const parseStr = (str: string) => {
  const hebrew = getHebrewText(str);
  const english = str.replace(hebrew, '').trim();

  return {
    word: hebrew,
    gloss: english,
  };
};

export function isWord(word: Word | Fragment): word is Word {
  return (word as Word).pos !== undefined;
}

export function isFragment(fragment: Word | Fragment): fragment is Fragment {
  return (fragment as Fragment).fragment !== undefined;
}

const addWord = (level: number, pos: string, str: string, description: string) => {
  // console.log({ level, pos, str, description });

  words[pos] = pos;

  const parent = getParent(level);

  if (!parent) {
    throw Error('Invalid Word Adding');
  }

  const { word, gloss } = parseStr(str);

  parent.children.push({
    level,
    parent,
    children: [],
    content: {
      pos,
      word,
      gloss,
      description,
    },
  });

  lastAdded = parent.children[parent.children.length - 1];
};

const addFragment = (level: number, fragment: string, description: string) => {
  fragments[fragment] = fragment;

  // console.log({ level, fragment, description });

  const parent = getParent(level);

  if (!parent) {
    throw Error('Invalid Fragment Adding');
  }

  parent.children.push({
    level,
    parent,
    children: [],
    content: {
      fragment,
      description,
    },
  });

  lastAdded = parent.children[parent.children.length - 1];
};

const getSimpleGrammar = () => {
  return rootNode;
};

(window as any).simpleGrammar = () => {
  function dfs(node: GrammarNode) {
    delete node.parent;

    node.children.forEach((child) => dfs(child));
  }

  dfs(rootNode);

  // console.log(rootNode);
};

export const db: SimpleGrammarDB = {
  getLogger,
  addWord,
  addFragment,
  getSimpleGrammar,
  clear,
};
