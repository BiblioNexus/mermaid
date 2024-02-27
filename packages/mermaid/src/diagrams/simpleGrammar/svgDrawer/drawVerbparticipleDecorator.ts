import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawVerbparticipleDecorator(): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const radius = (settings.height * 2) / 3;

  const width = radius / 2;
  const height = radius;

  function drawHalfCircle(context: d3.Path): d3.Path {
    context.moveTo(0, 0);
    context.arc(0, height / 2, height / 2, -Math.PI / 2, Math.PI / 2);
    context.lineTo(width, height);
    return context;
  }

  d3Elem
    .append('path')
    .attr('d', drawHalfCircle(d3.path()).toString())
    .attr('fill', 'none')
    .attr('stroke', settings.wordColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height,
    verticalEnd: height,
    herizontalStart: 0,
    herizontalCenter: height,
    herizontalEnd: height,
  };
}
