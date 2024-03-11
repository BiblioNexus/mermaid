import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit, GrammarNode } from '../simpleGrammarTypes.js';
import { isGraphicalNode } from '../utils.js';

import { ruler } from '../utils.js';

export function drawContainer(
  node: GrammarNode,
  title: string,
  color: string,
  strokeColor: string
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const word = title;
  const rect = ruler(word);

  const textWidth = rect.width || 0;
  const textHeight = rect.height || 0;

  let maxWidth = 0;
  let totalHeight = textHeight + settings.padding;

  for (const child of node.children) {
    if (isGraphicalNode(child)) {
      maxWidth = Math.max(maxWidth, child.drawUnit.width);
      totalHeight += child.drawUnit.height;
    }
  }

  const width = Math.max(textWidth, maxWidth);
  const height = totalHeight + 2 * settings.padding;

  d3Elem
    .append('text')
    .attr('x', 0)
    .attr('y', settings.padding + textHeight / 2)
    .attr('stroke', strokeColor)
    .attr('fill', color)
    .attr('font-family', settings.fontFamily)
    .attr('font-size', settings.fontSize)
    .attr('transform', `translate(${width - rect.width}, 0)`)
    .text(word);

  const childrenContainer = d3Elem.append('g');

  const xOrigin = width;
  let yOrigin = textHeight + settings.padding;

  for (const child of node.children) {
    if (isGraphicalNode(child)) {
      childrenContainer
        .append(() => child.drawUnit.element.node())
        .attr('transform', `translate(${xOrigin - child.drawUnit.width}, ${yOrigin})`);
      yOrigin += child.drawUnit.height;
    }
  }

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
