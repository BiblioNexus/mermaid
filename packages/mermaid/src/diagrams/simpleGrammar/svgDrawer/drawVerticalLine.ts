import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, StatusType } from '../simpleGrammarTypes.js';
import { getColorByStatus } from './utils.js';

export const drawVerticalLine = (status?: StatusType): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const width = 2 * settings.padding;
  const height = 2 * settings.padding;

  const verticalLineData: [number, number][] = [
    [width / 2, 0],
    [width / 2, height],
  ];

  const horizontalLineData: [number, number][] = [
    [0, height],
    [width, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(horizontalLineData))
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

  d3Elem
    .append('path')
    .attr('d', lineGenerator(verticalLineData))
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
};
