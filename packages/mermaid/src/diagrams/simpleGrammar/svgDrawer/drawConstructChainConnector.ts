import * as d3 from 'd3';

import { settings } from '../settings.js';
import { isWord } from '../utils.js';

import type { DrawUnit, GraphicalNode } from '../simpleGrammarTypes.js';
import {
  adjectivalKey,
  adjectiveKey,
  getKeyFromNode,
  relativeClauseKey,
  verbinfinitiveKey,
  verbparticipleKey,
} from '../syntacticParser/keys.js';
import { horizontalMerge, verticalMerge } from './utils.js';
import { drawEmptyWord } from './drawEmptyWord.js';
import { drawEmptyLine } from './drawEmptyLine.js';
import { drawWord } from './drawWord.js';
import { drawVerbInifinitiveDecorator } from './drawVerbInifinitiveDecorator.js';

export function drawConstructChainConnector(
  nodes: GraphicalNode[],
  options?: {
    horizontalLine?: boolean;
    drawUnit?: DrawUnit;
  },
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  let totalWidth = 0;

  const drawUnits = nodes.map((child) => {
    if (
      [adjectivalKey, adjectiveKey, relativeClauseKey].includes(
        getKeyFromNode(child),
      )
    ) {
      return verticalMerge(
        [drawEmptyWord(), drawEmptyLine(child.drawUnit.width), child.drawUnit],
        { align: 'center', verticalCenter: drawEmptyWord().height },
      );
    } else if (
      child.content &&
      isWord(child.content) &&
      getKeyFromNode(child) !== verbparticipleKey
    ) {
      const drawUnit = drawWord(child, true);

      if (getKeyFromNode(child) === verbinfinitiveKey) {
        return horizontalMerge([drawUnit, drawVerbInifinitiveDecorator()], {
          align: 'center',
        });
      }

      return drawUnit;
    } else {
      return child.drawUnit;
    }
  });

  drawUnits.forEach((unit) => (totalWidth += unit.width));

  const width = totalWidth + settings.padding * (drawUnits.length - 1);

  const childrenContainer = d3Elem.append('g');

  let xOrigin = width;
  let yOrigin = 0;

  const horizontalLineData: [number, number][] = [
    [0, drawUnits[0].verticalCenter],
    [width, drawUnits[0].verticalCenter],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  if (options?.horizontalLine) {
    d3Elem
      .append('path')
      .attr('d', lineGenerator(horizontalLineData))
      .attr('fill', 'none')
      .attr('stroke', settings.strokeColor)
      .attr('stroke-width', settings.lineStrokeWidth);
  }

  for (let i = 0; i < drawUnits.length; i++) {
    let unit = drawUnits[i];

    if (i === 0 && options?.drawUnit) {
      unit = horizontalMerge([options?.drawUnit, unit], { align: 'center' });
    }

    childrenContainer
      .append(() => unit.element.node())
      .attr('transform', `translate(${xOrigin - unit.width}, ${yOrigin})`);

    xOrigin -= unit.width + settings.padding;
    yOrigin += unit.verticalCenter;

    if (i < drawUnits.length - 1) {
      const verticalLineHeight = Math.max(
        unit.height - unit.verticalCenter,
        drawUnits[i + 1].verticalCenter,
      );

      const data: [number, number][] = [
        [xOrigin + unit.width + settings.padding, yOrigin],
        [xOrigin, yOrigin],
        [xOrigin, yOrigin + verticalLineHeight],
      ];

      childrenContainer
        .append('path')
        .attr('d', lineGenerator(data))
        .attr('fill', 'none')
        .attr('stroke', settings.strokeColor)
        .attr('stroke-width', settings.lineStrokeWidth);

      yOrigin += verticalLineHeight - drawUnits[i + 1].verticalCenter;
    } else {
      yOrigin += unit.height - unit.verticalCenter;
    }
  }

  return {
    width,
    height: yOrigin,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: drawUnits[0].verticalCenter,
    verticalEnd: yOrigin,
    horizontalStart: width - drawUnits[0].width - settings.padding,
    horizontalCenter: width - drawUnits[0].width,
    horizontalEnd: width,
  };
}
