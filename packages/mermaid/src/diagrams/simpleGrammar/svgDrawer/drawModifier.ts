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

export const drawModifier = (
  node: GrammarNode | GraphicalNode,
  status?: StatusType,
): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('ModifierDrawer Only draw Word');
  }

  const rect1 = ruler(getHebrew({ status, hebrew: node.content.word }));
  const rect2 = ruler(node.content.gloss);

  const width =
    rect1.width + rect2.width + 2 * settings.padding + 2 * settings.wordPadding;
  const height = (settings.height * 2) / 3;

  const slashData: [number, number][] = [
    [settings.padding + rect1.width + 2 * settings.wordPadding, 0],
    [settings.padding + rect1.width, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
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

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr(
      'transform',
      `translate(${settings.padding}, ${(rect1.height + settings.wordPadding) / 2})`,
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
      `translate(${settings.padding + 2 * settings.wordPadding + rect1.width}, ${
        (rect2.height + settings.wordPadding) / 2
      })`,
    );

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: settings.padding + rect1.width,
    horizontalEnd: width,
  };
};
