import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export const drawWhitespaceDecorator = (): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const width = 2 * settings.padding;
  const height = 0;

  const data: [number, number][] = [
    [0, 0],
    [width, 0],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', 'transparent')
    .attr('stroke-width', settings.lineStrokeWidth);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: 0,
    verticalEnd: height,
    herizontalStart: 0,
    herizontalCenter: width / 2,
    herizontalEnd: width,
  };
};
