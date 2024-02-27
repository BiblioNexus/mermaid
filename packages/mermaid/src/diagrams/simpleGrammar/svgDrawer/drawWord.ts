import * as d3 from 'd3';

import { isWord, ruler } from '../utils.js';

import { settings } from '../settings.js';

import type { DrawUnit, GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

export const drawWord = (node: GrammarNode | GraphicalNode): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('WordDrawer Only draw Word');
  }

  const rect1 = ruler(node.content.word);
  const rect2 = ruler(node.content.gloss);

  const width = Math.max(rect1.width, rect2.width) + 2 * settings.padding;
  const height = settings.height;

  const data: [number, number][] = [
    [0, height],
    [width, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', settings.wordColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.wordColor)
    .attr('fill', settings.wordColor)
    .attr('transform', `translate(${(width - rect1.width) / 2}, ${height - settings.wordPadding})`)
    .text(node.content.word);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.glossColor)
    .attr('fill', settings.glossColor)
    .attr(
      'transform',
      `translate(${(width - rect2.width) / 2}, ${height - rect1.height - settings.wordPadding})`
    )
    .text(node.content.gloss);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height,
    verticalEnd: height,
    herizontalStart: 0,
    herizontalCenter: width / 2,
    herizontalEnd: width,
  };
};
