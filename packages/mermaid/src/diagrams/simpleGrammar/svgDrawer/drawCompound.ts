import * as d3 from 'd3';

import { settings } from '../settings.js';

import type {
  DrawUnit,
  GraphicalNode,
  StatusType,
} from '../simpleGrammarTypes.js';
import { isConjunction } from '../syntacticParser/utils.js';
import { drawConjunction } from './drawConjunction.js';
import { drawEmptyLine } from './drawEmptyLine.js';
import { drawSpacer } from './drawSpacer.js';
import { getColorByStatus, horizontalMerge, verticalMerge } from './utils.js';
import {
  adjectiveKey,
  conjunctionKey,
  getKeyFromNode,
  prepositionalPhraseKey,
} from '../syntacticParser/keys.js';
import { drawWord } from './drawWord.js';
import { drawEmptyWord } from './drawEmptyWord.js';

export const drawCompound = (
  nodes: GraphicalNode[],
  lineType: 'solid' | 'dash',
  withDecorator: boolean,
  status?: StatusType,
): DrawUnit => {
  let firstNodeDrawUnit = drawEmptyLine({ status });
  let conjunction = null;

  if (isConjunction(nodes[0])) {
    conjunction = nodes[0];
  } else {
    firstNodeDrawUnit = (nodes[0] as GraphicalNode).drawUnit;

    if (getKeyFromNode(nodes[0]) === prepositionalPhraseKey) {
      firstNodeDrawUnit = verticalMerge(
        [
          drawEmptyWord(status),
          drawEmptyLine({ lineWidth: firstNodeDrawUnit.width, status }),
          firstNodeDrawUnit,
        ],
        {
          align: 'center',
          verticalStart: 0,
          verticalCenter: drawEmptyWord(status).verticalCenter,
          verticalEnd: firstNodeDrawUnit.verticalEnd,
        },
      );
    }

    if ([adjectiveKey].includes(getKeyFromNode(nodes[0]))) {
      firstNodeDrawUnit = drawWord(nodes[0], {
        withLine: true,
        status: nodes[0].status,
      });
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

    if ([adjectiveKey].includes(getKeyFromNode(child))) {
      secondNodeDrawUnit = drawWord(child, {
        withLine: true,
        status: child.status,
      });
    }

    if (getKeyFromNode(nodes[i]) === prepositionalPhraseKey) {
      secondNodeDrawUnit = verticalMerge(
        [
          drawEmptyWord(status),
          drawEmptyLine({ lineWidth: secondNodeDrawUnit.width, status }),
          secondNodeDrawUnit,
        ],
        {
          align: 'center',
          verticalStart: 0,
          verticalCenter: drawEmptyWord(status).verticalCenter,
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

    const conjunctionNode = conjunction
      ? getKeyFromNode(conjunction) === conjunctionKey
        ? conjunction
        : conjunction.children[0]
      : undefined;

    firstNodeDrawUnit = horizontalMerge(
      [
        mergedDrawUnit,
        drawConjunction({
          basicHeight: height,
          node: conjunctionNode,
          lineType,
          status: conjunctionNode?.status || status,
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
    .attr(
      'stroke',
      getColorByStatus({
        status,
        defaultColor: settings.strokeColor,
        type: 'line',
      }),
    )
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
