import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export const drawVerbInifinitiveDecorator = (): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const width = settings.padding;
  const height = 3 * settings.padding;

  const verticalLineData: [number, number][] = [
    [width, 0],
    [width, height],
  ];

  const herizontalLineData: [number, number][] = [
    [0, (height * 2) / 3],
    [width, (height * 2) / 3],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(herizontalLineData))
    .attr('fill', 'none')
    .attr('stroke', settings.wordColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(verticalLineData))
    .attr('fill', 'none')
    .attr('stroke', settings.wordColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: (height * 2) / 3,
    verticalEnd: height,
    herizontalStart: 0,
    herizontalCenter: width / 2,
    herizontalEnd: width,
  };
};
