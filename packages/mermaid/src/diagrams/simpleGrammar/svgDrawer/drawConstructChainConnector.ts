import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawConstructChainConnector(drawUnits: DrawUnit[]): DrawUnit {
  const d3Elem = d3.create('svg:g');

  let totalWidth = 0;
  let maxTopHeight = 0;
  let maxBottomHeight = 0;

  drawUnits.forEach((unit, i) => {
    totalWidth += unit.width;
    maxTopHeight = Math.max(maxTopHeight, unit.verticalCenter - settings.height * i);
    maxBottomHeight = Math.max(
      maxBottomHeight,
      unit.height - unit.verticalCenter + settings.height * i
    );
  });

  const width = totalWidth + settings.padding * (drawUnits.length - 1);
  const height = maxBottomHeight + maxTopHeight;

  const childrenContainer = d3Elem.append('g');

  let xOrigin = width;
  let yOrigin = maxTopHeight;

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  for (let i = 0; i < drawUnits.length; i++) {
    const unit = drawUnits[i];

    childrenContainer
      .append(() => unit.element.node())
      .attr('transform', `translate(${xOrigin - unit.width}, ${yOrigin - unit.verticalCenter})`);

    xOrigin -= unit.width + settings.padding;
    yOrigin += settings.height;

    if (i < drawUnits.length - 1) {
      const data: [number, number][] = [
        [xOrigin + unit.width + settings.padding, yOrigin - settings.height],
        [xOrigin, yOrigin - settings.height],
        [xOrigin, yOrigin],
      ];

      childrenContainer
        .append('path')
        .attr('d', lineGenerator(data))
        .attr('fill', 'none')
        .attr('stroke', settings.strokeColor)
        .attr('stroke-width', settings.lineStrokeWidth);
    }
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: drawUnits[0].verticalCenter,
    verticalEnd: drawUnits[0].verticalEnd,
    horizontalStart: width - drawUnits[0].width - settings.padding,
    horizontalCenter: width - drawUnits[0].width,
    horizontalEnd: width,
  };
}
