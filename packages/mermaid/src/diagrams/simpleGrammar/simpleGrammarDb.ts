import { log } from '../../logger.js';

import type { SimpleGrammarDB, Fragment, Word, GrammarNode } from './simpleGrammarTypes.js';

const keywords: Record<string, string> = {
  clausecluster: 'ClauseCluster',
  constructchain: 'ConstructChain',
  discourseunit: 'DiscourseUnit',
  prepositionalphrase: 'PrepositionalPhrase',
  relativeclause: 'RelativeClause',
  relativeparticle: 'RelativeParticle',
  subordinateclause: 'SubordinateClause',
  secondobject: 'SecondObject',
  complementclause: 'ComplementClause',
};

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

const getDelimited = (str: string, left: string, right: string) => {
  let result = '';
  let remainStr = '';
  let status: 'init' | 'started' | 'ended' = 'init';

  let i = 0;

  while (i < str.length) {
    if (status === 'init' && str[i] === left) {
      status = 'started';
      i++;
      continue;
    }

    if (status === 'started' && str[i] === right) {
      status = 'ended';
      i++;
      continue;
    }

    if (status === 'started') {
      result = result + str[i];
    } else {
      remainStr += str[i];
    }

    i++;
  }

  return {
    result,
    remainStr,
  };
};

const getDescription = (str: string) => {
  return getDelimited(str, '[', ']');
};

const getArguments = (str: string) => {
  return getDelimited(str, '<', '>');
};

const parseStr = (str: string) => {
  const descriptionResult = getDescription(str);
  const argumentsResult = getArguments(descriptionResult.remainStr);

  const hebrew = getHebrewText(argumentsResult.remainStr);
  const english = argumentsResult.remainStr.replace(hebrew, '').trim();

  return {
    word: hebrew,
    gloss: english,
    description: descriptionResult.result,
    argumentsStr: argumentsResult.result,
  };
};

const getFirstWord = (line: string) => {
  let word = '';

  let i = 0;
  let isStarted = false;

  while (i < line.length) {
    if (line[i] !== ' ' && isStarted === false) {
      isStarted = true;
    }

    if ((line[i] === ' ' || line[i] === ':') && isStarted) {
      return word;
    }

    if (isStarted) {
      word = word + line[i];
    }

    i++;
  }

  return word;
};

export function isWord(word: Word | Fragment): word is Word {
  return (word as Word).pos !== undefined;
}

export function isFragment(fragment: Word | Fragment): fragment is Fragment {
  return (fragment as Fragment).fragment !== undefined;
}

const addWord = (level: number, pos: string, str: string) => {
  words[pos] = pos;

  const parent = getParent(level);

  if (!parent) {
    throw Error('Invalid Word Adding');
  }

  const { word, gloss, description, argumentsStr } = parseStr(str);

  parent.children.push({
    level,
    parent,
    children: [],
    content: {
      pos,
      word,
      gloss,
      description,
      arguments: argumentsStr,
    },
  });

  lastAdded = parent.children[parent.children.length - 1];
};

const addFragment = (level: number, fragment: string, str: string) => {
  fragments[fragment] = fragment;

  const parent = getParent(level);

  if (!parent) {
    throw Error('Invalid Fragment Adding');
  }

  const { description, argumentsStr } = parseStr(str);

  parent.children.push({
    level,
    parent,
    children: [],
    content: {
      fragment: keywords[fragment.toLowerCase()] ? keywords[fragment.toLowerCase()] : fragment,
      description,
      arguments: argumentsStr,
    },
  });

  lastAdded = parent.children[parent.children.length - 1];
};

const addNewLine = (indent: number, line: string) => {
  const firstWord = getFirstWord(line);

  if (firstWord.trim() === '') {
    return;
  }

  const l = line.slice(firstWord.length);

  if (l.startsWith(':')) {
    addWord(indent, firstWord, l.slice(1).trim());
  } else {
    addFragment(indent, firstWord, l.trim());
  }
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

  console.log(rootNode);
};

export const db: SimpleGrammarDB = {
  getLogger,
  addNewLine,
  addWord,
  addFragment,
  getSimpleGrammar,
  clear,
};
