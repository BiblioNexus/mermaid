import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, StatusType } from '../simpleGrammarTypes.js';
import { getColorByStatus } from './utils.js';

export const drawClauseDecorator = ({
  drawUnit,
  status,
}: {
  drawUnit?: DrawUnit;
  status?: StatusType;
}): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const basicWidth = 2 * settings.padding;
  const basicHeight = 3 * settings.padding;

  const width = Math.max(drawUnit?.width || 0, basicWidth) + basicWidth / 2;
  const height = basicHeight + (drawUnit?.height || 0);

  if (drawUnit) {
    d3Elem
      .append(() => drawUnit.element.node())
      .attr('transform', `translate(0, ${basicHeight})`);
  }

  const startX = drawUnit?.horizontalCenter || 0 + basicWidth / 2;

  const verticalLineData: [number, number][] = [
    [startX, 0],
    [startX, basicHeight],
  ];

  const horizontalLineData: [number, number][] = [
    [0, (basicHeight * 2) / 3],
    [width, (basicHeight * 2) / 3],
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
    verticalCenter: (basicHeight * 2) / 3,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
};
