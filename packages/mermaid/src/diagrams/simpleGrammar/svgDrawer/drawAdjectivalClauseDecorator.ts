import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, StatusType } from '../simpleGrammarTypes.js';
import { getColorByStatus } from './utils.js';

export function drawAdjectivalClauseDecorator(
  drawUnit: DrawUnit,
  status?: StatusType,
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  d3Elem.append(() => drawUnit.element.node());

  const triangleEdge = 2 * settings.padding;
  const triangleHeight = (triangleEdge * Math.sqrt(3)) / 2;

  const width = drawUnit.width + 2 * settings.height;
  const height = drawUnit.height + settings.height + triangleHeight;

  const startX = drawUnit.width;
  const startY = drawUnit.verticalCenter;

  const data: [number, number][][] = [
    [
      [startX, startY],
      [startX, height - triangleHeight],
      [startX - triangleEdge / 2, height],
      [startX + triangleEdge / 2, height],
      [startX, height - triangleHeight],
    ],
    [
      [startX - triangleEdge / 2 - settings.padding, height],
      [startX + triangleEdge / 2, height],
      [startX + 2 * settings.height, 0],
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
      .attr(
        'stroke',
        getColorByStatus({
          status,
          defaultColor: settings.strokeColor,
          type: 'line',
        }),
      )
      .attr('stroke-width', settings.lineStrokeWidth);
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
}
