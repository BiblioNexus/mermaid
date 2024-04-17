import * as d3 from 'd3';

import { ruler } from '../utils.js';
import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export const drawError = (fragment: string, description: string): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const rect1 = ruler(fragment);
  const rect2 = ruler(description);

  const width = Math.max(rect1.width, rect2.width) + 2 * settings.padding;
  const height = rect1.height + rect2.height + 3 * settings.wordPadding;

  d3Elem
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', settings.errorFillColor)
    .attr('rx', '10px');

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.errorColor)
    .attr('fill', settings.errorColor)
    .attr(
      'transform',
      `translate(${(width - rect1.width) / 2}, ${rect1.height})`,
    )
    .text(fragment);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.errorColor)
    .attr('fill', settings.errorColor)
    .attr(
      'transform',
      `translate(${(width - rect2.width) / 2}, ${rect1.height + rect2.height + settings.wordPadding})`,
    )
    .text(description);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
};
