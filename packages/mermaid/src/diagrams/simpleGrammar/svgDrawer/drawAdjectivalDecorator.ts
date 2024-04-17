import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawAdjectivalDecorator(
  height: number = settings.height,
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const width = height / 2;

  function drawHalfCircle(context: d3.Path): d3.Path {
    context.moveTo(0, 0);
    context.arc(0, height / 2, height / 2, -Math.PI / 2, Math.PI / 2);
    context.lineTo(-settings.padding, height);
    return context;
  }

  d3Elem
    .append('path')
    .attr('d', drawHalfCircle(d3.path()).toString())
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width,
    horizontalEnd: width,
  };
}
