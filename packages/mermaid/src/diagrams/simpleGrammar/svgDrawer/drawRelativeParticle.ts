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

export function drawRelativeParticle(
  node: GrammarNode | GraphicalNode,
  drawUnit: DrawUnit,
  status?: StatusType,
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('drawRelativeParticle Only draw Word');
  }

  const rect1 = ruler(getHebrew({ status, hebrew: node.content.word }));
  const rect2 = ruler(node.content.gloss);

  const width =
    (drawUnit?.width || 0) +
    settings.height +
    settings.wordPadding +
    rect2.width;
  const height = settings.height + settings.padding + (drawUnit?.height || 0);

  if (drawUnit) {
    d3Elem
      .append(() => drawUnit.element.node())
      .attr('transform', `translate(0, ${settings.padding})`);
  }

  const startX = drawUnit?.width || 0;
  const startY = drawUnit?.verticalCenter + settings.padding || 0;

  const data: [number, number][] = [
    [startX, startY],
    [startX + settings.height, startY],
    [startX + settings.height, 0],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke-dasharray', '3,3')
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
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
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
    .attr(
      'transform',
      `translate(${width - rect2.width - rect1.width - 2 * settings.wordPadding}, ${
        startY - settings.padding
      })`,
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
      `translate(${width - rect2.width}, ${startY - settings.padding})`,
    );

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
}
