import * as d3 from 'd3';

import { isWord, ruler } from '../utils.js';

import { settings } from '../settings.js';

import type {
  DrawUnit,
  GrammarNode,
  GraphicalNode,
  StatusType,
} from '../simpleGrammarTypes.js';
import { drawGloss, getColorByStatus, getHebrew } from './utils.js';

export const drawWord = (
  node: GrammarNode | GraphicalNode,
  options?: { withLine?: boolean; status?: StatusType },
): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('WordDrawer Only draw Word');
  }

  const rect1 = ruler(
    getHebrew({ status: options?.status, hebrew: node.content.word }),
  );
  const rect2 = ruler(node.content.gloss);

  const width = Math.max(rect1.width, rect2.width) + 2 * settings.padding;
  const height = settings.height;

  const data: [number, number][] = [
    [0, height],
    [width, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  if (options?.withLine) {
    d3Elem
      .append('path')
      .attr('d', lineGenerator(data))
      .attr('fill', 'none')
      .attr(
        'stroke',
        getColorByStatus({
          status: options?.status,
          defaultColor: settings.strokeColor,
          type: 'line',
        }),
      )
      .attr('stroke-width', settings.lineStrokeWidth);
  }

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr(
      'stroke',
      getColorByStatus({
        status: node.status || options?.status,
        defaultColor: settings.wordStrokeColor,
        type: 'hebrew',
      }),
    )
    .attr(
      'fill',
      getColorByStatus({
        status: node.status || options?.status,
        defaultColor: settings.wordColor,
        type: 'hebrew',
      }),
    )
    .attr(
      'transform',
      `translate(${(width - rect1.width) / 2}, ${height - settings.wordPadding})`,
    )
    .text(getHebrew({ status: options?.status, hebrew: node.content.word }));

  const glossDraw = drawGloss(
    node.content.gloss,
    getColorByStatus({
      status: options?.status,
      defaultColor: settings.glossColor,
      type: 'gloss',
    }),
  );

  d3Elem
    .append(() => glossDraw.node())
    .attr(
      'transform',
      `translate(${(width - rect2.width) / 2}, ${height - rect1.height - settings.wordPadding})`,
    );

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
