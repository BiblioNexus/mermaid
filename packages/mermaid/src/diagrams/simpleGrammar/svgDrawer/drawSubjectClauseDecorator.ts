import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawSubjectClauseDecorator(moreHight: number): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const triangleEdge = 2 * settings.padding;
  const triangleHeight = (triangleEdge * Math.sqrt(3)) / 2;

  const width = 3 * settings.padding;
  const height = settings.height + triangleHeight + moreHight;

  const startX = 2 * settings.padding;
  const startY = 0;

  const data: [number, number][][] = [
    [
      [startX, startY],
      [startX, startY + height - triangleHeight],
      [startX - triangleEdge / 2, height],
      [startX + triangleEdge / 2, height],
      [startX, startY + height - triangleHeight],
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
    horizontalStart: width - settings.padding,
    horizontalCenter: width - settings.padding,
    horizontalEnd: width - settings.padding,
  };
}
