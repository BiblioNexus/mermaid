import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, StatusType } from '../simpleGrammarTypes.js';
import { getColorByStatus } from './utils.js';

export const drawEmptyLine = ({
  lineWidth = settings.height,
  status,
}: {
  lineWidth?: number;
  status?: StatusType;
}): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const width = lineWidth;
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
    verticalCenter: 0,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
};
