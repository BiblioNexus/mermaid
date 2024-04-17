import * as d3 from 'd3';

import { isWord, ruler } from '../utils.js';

import { settings } from '../settings.js';

import type {
  DrawUnit,
  GrammarNode,
  GraphicalNode,
} from '../simpleGrammarTypes.js';

export const drawConjunctionWithNode = ({
  basicHeight,
  node,
  lineType,
}: {
  basicHeight: number;
  node: GrammarNode | GraphicalNode;
  lineType: 'dash' | 'solid';
}): DrawUnit => {
  const d3Elem = d3.create('svg:g');

  if (!node.content || !isWord(node.content)) {
    throw new Error('WordDrawer Only draw Word');
  }

  const rect1 = ruler(node.content.word);
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
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  if (lineType === 'dash') {
    line.attr('stroke-dasharray', '3,3');
  }

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.wordStrokeColor)
    .attr('fill', settings.wordColor)
    .attr(
      'transform',
      `translate(${maxWordWidth - rect1.width - width}, ${height / 2 + settings.wordPadding})`,
    )
    .text(node.content.word);

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('stroke', settings.glossColor)
    .attr('fill', settings.glossColor)
    .attr(
      'transform',
      `translate(${maxWordWidth - rect2.width - width}, ${height / 2 - settings.wordPadding})`,
    )
    .text(node.content.gloss);

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
}: {
  basicHeight: number;
  lineType: 'dash' | 'solid';
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
    .attr('stroke', settings.strokeColor)
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
}: {
  basicHeight: number;
  node?: GrammarNode | GraphicalNode;
  lineType: 'dash' | 'solid';
}): DrawUnit => {
  if (node) {
    return drawConjunctionWithNode({
      basicHeight,
      node,
      lineType,
    });
  }

  return drawConjunctionWithEmpty({
    basicHeight,
    lineType,
  });
};
