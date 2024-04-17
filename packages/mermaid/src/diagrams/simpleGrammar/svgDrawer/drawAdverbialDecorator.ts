import * as d3 from 'd3';

import { settings } from '../settings.js';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawNormalAdverbialDecorator(): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const width = settings.height;
  const height = (3 / 2) * settings.height;

  const slashData: [number, number][] = [
    [0, height],
    [width, 0],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(slashData))
    .attr('fill', 'none')
    .attr('stroke-dasharray', '3,3')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

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

export function drawSpecialAdverbialDecorator(
  adverbDrawUnit: DrawUnit,
  adverbialDrawUnit: DrawUnit,
): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const horizontalCenter = Math.max(
    adverbDrawUnit.horizontalCenter,
    adverbialDrawUnit.horizontalCenter,
  );
  const width =
    horizontalCenter +
    Math.max(
      adverbDrawUnit.width - adverbDrawUnit.horizontalCenter,
      adverbialDrawUnit.width - adverbialDrawUnit.horizontalCenter,
    ) +
    50;
  const height = adverbDrawUnit.height + adverbialDrawUnit.height;

  d3Elem
    .append(() => adverbialDrawUnit.element.node())
    .attr(
      'transform',
      `translate(${horizontalCenter - adverbialDrawUnit.horizontalCenter}, ${adverbDrawUnit.height})`,
    );

  d3Elem
    .append(() => adverbDrawUnit.element.node())
    .attr(
      'transform',
      `translate(${horizontalCenter - adverbDrawUnit.horizontalCenter}, 0)`,
    );

  const startX = horizontalCenter + 7;
  const startY = (adverbDrawUnit.height * 2) / 3;

  const lineData: [number, number][] = [
    [startX, startY],
    [startX + 20, startY],
    [horizontalCenter + 20, adverbDrawUnit.height],
  ];

  const lineGenerator = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  d3Elem
    .append('path')
    .attr('d', lineGenerator(lineData))
    .attr('fill', 'none')
    .attr('stroke', settings.strokeColor)
    .attr('stroke-width', settings.lineStrokeWidth);

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: height / 2,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: Math.max(
      adverbDrawUnit.horizontalCenter,
      adverbialDrawUnit.horizontalCenter,
    ),
    horizontalEnd: width,
  };
}

export function drawAdverbialDecorator(props?: {
  adverbDrawUnit: DrawUnit;
  adverbialDrawUnit: DrawUnit;
}) {
  if (props) {
    return drawSpecialAdverbialDecorator(
      props.adverbDrawUnit,
      props.adverbialDrawUnit,
    );
  } else {
    return drawNormalAdverbialDecorator();
  }
}
