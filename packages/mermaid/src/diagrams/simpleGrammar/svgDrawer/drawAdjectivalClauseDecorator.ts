import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawAdjectivalClauseDecorator(): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const triangleEdge = 2 * settings.padding;
  const triangleHeight = (triangleEdge * Math.sqrt(3)) / 2;

  const width = settings.padding + 2 * settings.height;
  const height = 2 * settings.height + triangleHeight;

  const startX = 0;

  const data: [number, number][][] = [
    [
      [startX, settings.height],
      [startX, 2 * settings.height],
      [startX - triangleEdge / 2, height],
      [startX + triangleEdge / 2, height],
      [startX, 2 * settings.height],
    ],
    [
      [startX - triangleEdge / 2 - settings.padding, height],
      [startX + triangleEdge / 2, height],
      [startX + 2 * settings.height, 0],
      [startX + settings.padding, 0],
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
      .attr('stroke', settings.strokeColor)
      .attr('stroke-width', settings.lineStrokeWidth);
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: settings.height,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: 2 * settings.padding,
    horizontalEnd: width,
  };
}
