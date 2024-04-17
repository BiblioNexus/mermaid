import * as d3 from 'd3';

import { isFragment, ruler } from '../utils.js';

import { settings } from '../settings.js';

import type { DrawUnit, GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

export const drawMockFragment = (node: GrammarNode | GraphicalNode): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isFragment(node.content)) {
    throw new Error('MockFragmentDrawer Only draw Fragment');
  }

  const rect = ruler(node.content.fragment);

  const width = rect.width + 2 * settings.padding;
  const height = settings.height;

  const data: [number, number][] = [
    [0, height],
    [width, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.glossColor)
    .attr('fill', settings.glossColor)
    .attr(
      'transform',
      `translate(${(width - rect.width) / 2}, ${height - rect.height - settings.wordPadding})`
    )
    .text(node.content.fragment);

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
