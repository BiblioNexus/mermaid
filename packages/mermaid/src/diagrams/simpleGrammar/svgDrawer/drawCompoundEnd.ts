import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export const drawCompoundEnd = (
  drawUnit: DrawUnit,
  lineType: 'solid' | 'dash',
  withDecorator: boolean,
): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const decoratorWidth = withDecorator
    ? settings.wordPadding + 2 * settings.padding
    : 0;
  const lineConnectorWidth = settings.padding;

  d3Elem
    .append(() => drawUnit.element.node())
    .attr(
      'transform',
      `translate(${lineConnectorWidth + decoratorWidth}, ${0})`,
    );

  const lineWidth = drawUnit.horizontalEnd - drawUnit.horizontalStart;

  const width = drawUnit.width + lineConnectorWidth + decoratorWidth;
  const height = drawUnit.height;

  const lineData1: [number, number][] = [
    [0, drawUnit.verticalCenter],
    [lineConnectorWidth, drawUnit.verticalCenter],
  ];
  const lineData2: [number, number][] = [
    [lineConnectorWidth + decoratorWidth, drawUnit.verticalStart],
    [lineConnectorWidth + decoratorWidth + lineWidth, drawUnit.verticalStart],
  ];
  const lineData3: [number, number][] = [
    [lineConnectorWidth + decoratorWidth, drawUnit.verticalEnd],
    [lineConnectorWidth + decoratorWidth + lineWidth, drawUnit.verticalEnd],
  ];
  const lineData4: [number, number][] = [
    [lineConnectorWidth + decoratorWidth, drawUnit.verticalStart],
    [lineConnectorWidth + decoratorWidth, drawUnit.verticalEnd],
  ];
  const lineDecoratorData: [number, number][] = withDecorator
    ? [
        [lineConnectorWidth + decoratorWidth, drawUnit.verticalStart],
        [lineConnectorWidth, drawUnit.verticalCenter],
        [lineConnectorWidth + decoratorWidth, drawUnit.verticalEnd],
      ]
    : [];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  [lineData1, lineData2, lineData3, lineDecoratorData].forEach((data) => {
    d3Elem
      .append('path')
      .attr('d', lineGenerator(data))
      .attr('fill', 'none')
      .attr('stroke', settings.strokeColor)
      .attr('stroke-width', settings.lineStrokeWidth);
  });

  const line = d3Elem.append('path');

  line
    .attr('d', lineGenerator(lineData4))
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  if (lineType === 'dash') {
    line.attr('stroke-dasharray', '3,3');
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: drawUnit.verticalStart,
    verticalCenter: drawUnit.verticalCenter,
    verticalEnd: drawUnit.verticalEnd,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
};
