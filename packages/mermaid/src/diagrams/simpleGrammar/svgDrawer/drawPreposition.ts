import * as d3 from 'd3';

import { isWord, ruler } from '../utils.js';

import { settings } from '../settings.js';

import type { DrawUnit, GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

export function drawPreposition(
  node: GrammarNode | GraphicalNode,
  height: number = settings.height
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('drawPreposition Only draw Word');
  }

  const rect1 = ruler(node.content.word);
  const rect2 = ruler(node.content.gloss);

  const lineBottom = height / Math.sqrt(3);

  const width = Math.max(
    lineBottom,
    rect1.width + rect2.width + 2 * settings.padding + 2 * settings.wordPadding
  );

  const slashData: [number, number][] = [
    [width, 0],
    [(width + lineBottom) / 2, 0],
    [(width - lineBottom) / 2, height],
    [0, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(slashData))
    .attr('fill', 'none')
    .attr('stroke', settings.wordColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  const lineData: [number, number][] = [
    [0, 0],
    [width, 0],
  ];

  d3Elem
    .append('path')
    .attr('d', lineGenerator(lineData))
    .attr('fill', 'none')
    .attr('stroke', settings.wordColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr(
      'transform',
      `translate(${width / 2 - 2 * settings.wordPadding - rect1.width}, ${
        (height + rect1.height) / 2
      })`
    )
    .attr('stroke', settings.wordColor)
    .attr('fill', settings.wordColor)
    .text(node.content.word);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.glossColor)
    .attr('fill', settings.glossColor)
    .attr(
      'transform',
      `translate(${width / 2 + settings.wordPadding}, ${(height + rect2.height) / 2})`
    )
    .text(node.content.gloss);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    herizontalStart: 0,
    herizontalCenter: width / 2,
    herizontalEnd: width,
  };
}
