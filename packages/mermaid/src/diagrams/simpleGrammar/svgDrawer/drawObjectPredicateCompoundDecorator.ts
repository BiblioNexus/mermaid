import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, GraphicalNode } from '../simpleGrammarTypes.js';

export const drawObjectPredicateCompoundDecorator = (node: GraphicalNode): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const width = node.drawUnit.width;
  const height = node.drawUnit.verticalEnd - node.drawUnit.verticalStart;

  const data: [number, number][] = [
    [2 * settings.padding, 0],
    [0, height / 2],
    [2 * settings.padding, height],
  ];

  const lineData: [number, number][] = [
    [width, 0],
    [2 * settings.padding, 0],
    [2 * settings.padding, height],
    [width, height],
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
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
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
    horizontalCenter: settings.padding * 2,
    horizontalEnd: settings.padding * 2,
  };
};
