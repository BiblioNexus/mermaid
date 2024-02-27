import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawObjectClauseDecorator(): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const triangleEdge = 2 * settings.padding;
  const triangleHeight = (triangleEdge * Math.sqrt(3)) / 2;

  const width = 3 * settings.padding + settings.height;
  const height = settings.height + triangleHeight;

  const startX = 2 * settings.padding;
  const startY = 0;

  const data: [number, number][][] = [
    [
      [startX, startY],
      [startX, startY + settings.height],
      [startX - triangleEdge / 2, height],
      [startX + triangleEdge / 2, height],
      [startX, settings.height],
    ],
    [
      [0, height],
      [width, height],
    ],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  for (const lineData of data) {
    d3Elem
      .append('path')
      .attr('d', lineGenerator(lineData))
      .attr('fill', 'none')
      .attr('stroke', settings.wordColor)
      .attr('stroke-width', settings.lineStrokeWidth);
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    herizontalStart: 2 * settings.padding,
    herizontalCenter: 2 * settings.padding,
    herizontalEnd: width,
  };
}
