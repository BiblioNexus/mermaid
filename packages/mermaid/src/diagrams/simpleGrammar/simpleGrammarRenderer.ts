import { configureSvgSize } from '../../setupGraphViewbox.js';

import type { DrawDefinition, SVG } from '../../diagram-api/types.js';
import type { GrammarNode, SimpleGrammarDB } from './simpleGrammarTypes.js';

import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';

import { parse } from './syntacticParser/parse.js';
import { shakingTree } from './syntacticParser/shakingTree.js';
import { settings } from './settings.js';

/**
 * Draws a Pie Chart with the data given in text.
 *
 * @param text - pie chart code
 * @param id - diagram id
 * @param _version - MermaidJS version from package.json.
 * @param diagObj - A standard diagram containing the DB and the text and type etc of the diagram.
 */
export const draw: DrawDefinition = (text, id, _version, diagObj) => {
  const db = diagObj.db as SimpleGrammarDB;
  const rootNode = db.getSimpleGrammar();
  function dfs(node: GrammarNode) {
    delete node.parent;
    node.children.forEach((child) => dfs(child));
  }
  dfs(rootNode);
  const graphicalNode = parse(shakingTree(JSON.parse(JSON.stringify(rootNode))));
  const svg: SVG = selectSvgElement(id);
  const nodesElem = svg.append('g');
  if (graphicalNode.drawUnit.element) {
    nodesElem.append(() => graphicalNode.drawUnit.element.node());
  }
  svg.attr('transform', `translate(${settings.padding}, ${0})`);

  configureSvgSize(
    svg,
    graphicalNode.drawUnit.height,
    graphicalNode.drawUnit.width + 200 + 2 * settings.padding,
    false
  );
};

export const renderer = { draw };
