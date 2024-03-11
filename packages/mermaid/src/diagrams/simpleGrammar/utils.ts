import { settings } from './settings.js';
import type { Word, GrammarNode, Fragment, GraphicalNode } from './simpleGrammarTypes.js';

export function isWord(word: Word | Fragment): word is Word {
  return (word as Word).pos !== undefined;
}

export function isFragment(fragment: Word | Fragment): fragment is Fragment {
  return (fragment as Fragment).fragment !== undefined;
}

export function isGraphicalNode(node: GrammarNode | GraphicalNode): node is GraphicalNode {
  return (node as GraphicalNode).drawUnit !== undefined;
}

export function isGrammarNode(node: GrammarNode | GraphicalNode): node is GrammarNode {
  return !isGraphicalNode(node);
}

export function ruler(textContent: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  document.body.appendChild(svg);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.textContent = textContent;
  text.setAttribute('font-size', `${settings.fontSize}px`);
  text.setAttribute('font-family', settings.fontFamily);
  text.setAttribute('stroke', settings.wordStrokeColor);

  svg.appendChild(text);

  // Get the width and height of the text element
  const textWidth = text.getComputedTextLength();
  const bbox = text.getBoundingClientRect();
  const textHeight = bbox.height;

  document.body.removeChild(svg);

  return {
    width: textWidth,
    height: textHeight,
  };
}
