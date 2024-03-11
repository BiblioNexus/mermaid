import * as d3 from 'd3';

import { isWord, ruler } from '../utils.js';

import { settings } from '../settings.js';

import type { DrawUnit, GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

export const drawConjunction = (node: GrammarNode | GraphicalNode, height: number): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('WordDrawer Only draw Word');
  }

  const rect1 = ruler(node.content.word);
  const rect2 = ruler(node.content.gloss);

  const maxWordWidth = Math.max(rect1.width, rect2.width);

  const width = maxWordWidth + settings.wordPadding + 2 * settings.padding;

  const data: [number, number][] = [
    [0, 0],
    [maxWordWidth + settings.wordPadding, 0],
    [width, height / 2],
    [maxWordWidth + settings.wordPadding, height],
    [0, height],
  ];

  const lineData: [number, number][] = [
    [maxWordWidth + settings.wordPadding, 0],
    [maxWordWidth + settings.wordPadding, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(lineData))
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.wordStrokeColor)
    .attr('fill', settings.wordColor)
    .attr(
      'transform',
      `translate(${maxWordWidth - rect1.width}, ${height / 2 + settings.wordPadding})`
    )
    .text(node.content.word);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.glossColor)
    .attr('fill', settings.glossColor)
    .attr(
      'transform',
      `translate(${maxWordWidth - rect2.width}, ${height / 2 - settings.wordPadding})`
    )
    .text(node.content.gloss);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: maxWordWidth + settings.wordPadding,
    horizontalEnd: width,
  };
};
