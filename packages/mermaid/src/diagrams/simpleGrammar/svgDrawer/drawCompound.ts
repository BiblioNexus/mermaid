import * as d3 from 'd3';

import { settings } from '../settings.js';

import { isWord } from '../utils.js';
import type { DrawUnit, GraphicalNode } from '../simpleGrammarTypes.js';
import { isConjunction } from '../syntacticParser/utils.js';
import { drawConjunction } from './drawConjunction.js';
import { drawEmptyLine } from './drawEmptyLine.js';
import { drawSpacer } from './drawSpacer.js';
import { horizontalMerge, verticalMerge } from './utils.js';
import {
  adjectiveKey,
  getKeyFromNode,
  prepositionalPhraseKey,
} from '../syntacticParser/keys.js';
import { drawWord } from './drawWord.js';
import { drawEmptyWord } from './drawEmptyWord.js';

export const drawCompound = (
  nodes: GraphicalNode[],
  lineType: 'solid' | 'dash',
  withDecorator: boolean,
): DrawUnit => {
  let firstNodeDrawUnit = drawEmptyLine();
  let conjunction = null;

  if (isConjunction(nodes[0])) {
    conjunction = nodes[0];
  } else {
    firstNodeDrawUnit = (nodes[0] as GraphicalNode).drawUnit;

    if (nodes[0].content && isWord(nodes[0].content)) {
      firstNodeDrawUnit = verticalMerge(
        [firstNodeDrawUnit, drawEmptyLine(firstNodeDrawUnit.width)],
        {
          align: 'center',
          verticalStart: firstNodeDrawUnit.verticalStart,
          verticalCenter: firstNodeDrawUnit.verticalCenter,
          verticalEnd: firstNodeDrawUnit.verticalEnd,
        },
      );
    }

    if (getKeyFromNode(nodes[0]) === prepositionalPhraseKey) {
      firstNodeDrawUnit = verticalMerge(
        [
          drawEmptyWord(),
          drawEmptyLine(firstNodeDrawUnit.width),
          firstNodeDrawUnit,
        ],
        {
          align: 'center',
          verticalStart: 0,
          verticalCenter: drawEmptyWord().verticalCenter,
          verticalEnd: firstNodeDrawUnit.verticalEnd,
        },
      );
    }

    if ([adjectiveKey].includes(getKeyFromNode(nodes[0]))) {
      firstNodeDrawUnit = drawWord(nodes[0], true);
    }
  }

  let totalHeight = 0;
  const firstVerticalCenter = firstNodeDrawUnit.verticalCenter;

  for (let i = 1; i < nodes.length; i++) {
    const child = nodes[i];

    if (isConjunction(child)) {
      if (i > 0 && isConjunction(nodes[i - 1])) {
        continue;
      } else {
        conjunction = child;
        continue;
      }
    }

    let secondNodeDrawUnit = (child as GraphicalNode).drawUnit;

    if (child.content && isWord(child.content)) {
      secondNodeDrawUnit = verticalMerge(
        [secondNodeDrawUnit, drawEmptyLine(secondNodeDrawUnit.width)],
        {
          align: 'center',
          verticalStart: secondNodeDrawUnit.verticalStart,
          verticalCenter: secondNodeDrawUnit.verticalCenter,
          verticalEnd: secondNodeDrawUnit.verticalEnd,
        },
      );

      if ([adjectiveKey].includes(getKeyFromNode(child))) {
        secondNodeDrawUnit = drawWord(child, true);
      }
    }

    if (getKeyFromNode(nodes[i]) === prepositionalPhraseKey) {
      secondNodeDrawUnit = verticalMerge(
        [
          drawEmptyWord(),
          drawEmptyLine(secondNodeDrawUnit.width),
          secondNodeDrawUnit,
        ],
        {
          align: 'center',
          verticalStart: 0,
          verticalCenter: drawEmptyWord().verticalCenter,
          verticalEnd: secondNodeDrawUnit.verticalEnd,
        },
      );
    }

    const spacerDrawUnit = drawSpacer();

    const height =
      firstNodeDrawUnit.height -
      firstNodeDrawUnit.verticalCenter +
      spacerDrawUnit.height +
      secondNodeDrawUnit.verticalCenter;

    totalHeight += height;

    const mergedDrawUnit = verticalMerge(
      [firstNodeDrawUnit, spacerDrawUnit, secondNodeDrawUnit],
      {
        align: 'end',
        verticalStart: firstNodeDrawUnit.verticalStart,
        verticalCenter: firstNodeDrawUnit.verticalCenter + height / 2,
      },
    );

    firstNodeDrawUnit = horizontalMerge(
      [
        mergedDrawUnit,
        drawConjunction({
          basicHeight: height,
          node: conjunction?.children[0] || undefined,
          lineType,
        }),
      ],
      {
        align: 'center',
        verticalStart: mergedDrawUnit.verticalStart,
        verticalCenter: firstNodeDrawUnit.verticalCenter + height,
        verticalEnd: mergedDrawUnit.verticalEnd,
      },
    );
  }

  if (totalHeight) {
    firstNodeDrawUnit = {
      ...firstNodeDrawUnit,
      verticalStart: firstVerticalCenter,
      verticalCenter: firstVerticalCenter + totalHeight / 2,
      verticalEnd: firstVerticalCenter + totalHeight,
    };
  }

  if (!withDecorator) {
    return firstNodeDrawUnit;
  }

  const d3Elem = d3.create('svg:g');

  d3Elem.append(() => firstNodeDrawUnit.element.node());

  const decoratorWidth = settings.wordPadding + 2 * settings.padding;

  const width = firstNodeDrawUnit.width + decoratorWidth;
  const height = firstNodeDrawUnit.height;

  const decoratorData: [number, number][] = [
    [firstNodeDrawUnit.width, firstNodeDrawUnit.verticalStart],
    [
      firstNodeDrawUnit.width + decoratorWidth,
      firstNodeDrawUnit.verticalCenter,
    ],
    [firstNodeDrawUnit.width, firstNodeDrawUnit.verticalEnd],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(decoratorData))
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: firstNodeDrawUnit.verticalStart,
    verticalCenter: firstNodeDrawUnit.verticalCenter,
    verticalEnd: firstNodeDrawUnit.verticalEnd,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: firstNodeDrawUnit.width,
  };
};
