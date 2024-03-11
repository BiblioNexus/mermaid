import * as d3 from 'd3';

import type { DrawUnit } from '../simpleGrammarTypes.js';

export function drawEmpty(): DrawUnit {
  const d3Elem = d3.create('svg:g');

  const width = 0;
  const height = 0;

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: 0,
    verticalCenter: 0,
    verticalEnd: height,
    horizontalStart: 0,
    horizontalCenter: width / 2,
    horizontalEnd: width,
  };
}
