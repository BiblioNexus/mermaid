import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, StatusType } from '../simpleGrammarTypes.js';
import { getColorByStatus } from './utils.js';

export function drawComplementClauseDecorator(
  drawUnit: DrawUnit,
  paddingRight: number,
  status?: StatusType,
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  d3Elem
    .append(() => drawUnit.element.node())
    .attr('transform', `translate(0, ${settings.height})`);

  const triangleEdge = 2 * settings.padding;
  const triangleHeight = (triangleEdge * Math.sqrt(3)) / 2;

  const width = drawUnit.width;
  const height = drawUnit.height + 2 * settings.height + triangleHeight;

  const startX = width - paddingRight;

  const startY = drawUnit.verticalCenter + settings.height;

  const data: [number, number][][] = [
    [
      [startX, startY],
      [startX, height - triangleHeight],
      [startX - triangleEdge / 2, height],
      [startX + triangleEdge / 2, height],
      [startX, height - triangleHeight],
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
    verticalCenter: height,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
}
