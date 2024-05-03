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

export function drawPreposition(
  node: GrammarNode | GraphicalNode,
  options?: {
    initialHeight?: number;
    lineType?: 'solid' | 'dash';
    status?: StatusType;
  },
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('drawPreposition Only draw Word');
  }

  const initialHeight = options?.initialHeight || settings.height;
  const lineType = options?.lineType || 'solid';
  const status = options?.status;

  const rect1 = ruler(getHebrew({ status, hebrew: node.content.word }));
  const rect2 = ruler(node.content.gloss);

  const height = initialHeight + settings.padding;

  const lineBottom = height / Math.sqrt(3);

  const width = Math.max(
    lineBottom,
    rect1.width + rect2.width + 2 * settings.padding + 2 * settings.wordPadding,
  );

  const slashData: [number, number][] = [
    [(width + lineBottom) / 2, 0],
    [(width - lineBottom) / 2, height],
    [0, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const line = d3Elem.append('path');

  line
    .attr('d', lineGenerator(slashData))
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

  if (lineType === 'dash') {
    line.attr('stroke-dasharray', '3,3');
  }

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr(
      'transform',
      `translate(${width / 2 - 2 * settings.wordPadding - rect1.width}, ${
        (height + rect1.height) / 2
      })`,
    )
    .attr(
      'stroke',
      getColorByStatus({
        status,
        defaultColor: settings.wordStrokeColor,
        type: 'hebrew',
      }),
    )
    .attr(
      'fill',
      getColorByStatus({
        status,
        defaultColor: settings.wordColor,
        type: 'hebrew',
      }),
    )
    .text(getHebrew({ status, hebrew: node.content.word }));

  const glossDraw = drawGloss(
    node.content.gloss,
    getColorByStatus({
      status: status,
      defaultColor: settings.glossColor,
      type: 'gloss',
    }),
  );

  d3Elem
    .append(() => glossDraw.node())
    .attr(
      'transform',
      `translate(${width / 2 + settings.wordPadding}, ${(height + rect2.height) / 2})`,
    );

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter:
      lineBottom === width ? lineBottom : rect1.width + lineBottom,
    horizontalEnd: width,
  };
}
