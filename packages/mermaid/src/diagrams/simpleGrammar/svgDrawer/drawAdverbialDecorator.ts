import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawAdverbialDecorator(): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const width = settings.height / 2;
  const height = (3 / 2) * settings.height;

  const lineData: [number, number][] = [
    [0, 0],
    [width, 0],
  ];

  const slashData: [number, number][] = [
    [0, height],
    [width, 0],
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
    .attr('d', lineGenerator(slashData))
    .attr('fill', 'none')
    .attr('stroke-dasharray', '3,3')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

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
