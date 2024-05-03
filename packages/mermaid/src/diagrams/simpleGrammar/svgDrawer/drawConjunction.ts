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

export const drawConjunctionWithNode = ({
  basicHeight,
  node,
  lineType,
  status,
}: {
  basicHeight: number;
  node: GrammarNode | GraphicalNode;
  lineType: 'dash' | 'solid';
  status?: StatusType;
}): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('WordDrawer Only draw Word');
  }

  const rect1 = ruler(getHebrew({ status, hebrew: node.content.word }));
  const rect2 = ruler(node.content.gloss);

  const maxWordWidth = Math.max(rect1.width, rect2.width);

  const width = maxWordWidth + settings.wordPadding;
  const height = basicHeight;

  const data: [number, number][] = [
    [0, 0],
    [0, height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const line = d3Elem.append('path');

  line
    .attr('d', lineGenerator(data))
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
      `translate(${maxWordWidth - rect1.width - width}, ${height / 2 + settings.wordPadding})`,
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
      `translate(${maxWordWidth - rect2.width - width}, ${height / 2 - settings.wordPadding})`,
    );

  return {
    width: 0,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: 0,
    horizontalEnd: 0,
  };
};

export const drawConjunctionWithEmpty = ({
  basicHeight,
  lineType,
  status,
}: {
  basicHeight: number;
  lineType: 'dash' | 'solid';
  status?: StatusType;
}): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  const width = 0;

  const data: [number, number][] = [
    [width, 0],
    [width, basicHeight],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const line = d3Elem.append('path');

  line
    .attr('d', lineGenerator(data))
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

  return {
    width,
    height: basicHeight,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: basicHeight / 2,
    verticalEnd: basicHeight,
    horizontalStart: width,
    horizontalCenter: width,
    horizontalEnd: width,
  };
};

export const drawConjunction = ({
  basicHeight,
  node,
  lineType,
  status,
}: {
  basicHeight: number;
  node?: GrammarNode | GraphicalNode;
  lineType: 'dash' | 'solid';
  status?: StatusType;
}): DrawUnit => {
  if (node) {
    return drawConjunctionWithNode({
      basicHeight,
      node,
      lineType,
      status,
    });
  }

  return drawConjunctionWithEmpty({
    basicHeight,
    lineType,
    status,
  });
};
