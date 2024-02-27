import * as d3 from 'd3';

import type { DrawUnit } from '../simpleGrammarTypes.js';

type Alignment = 'start' | 'center' | 'end';

type MergeOptions = {
  align: Alignment[] | Alignment;
  height?: number;
  width?: number;
  verticalCenter?: number;
  verticalStart?: number;
  verticalEnd?: number;
  herizontalStart?: number;
  herizontalEnd?: number;
  herizontalCenter?: number;
};

export function verticalMerge(drawUnits: DrawUnit[], options?: MergeOptions): DrawUnit {
  if (
    options?.align &&
    Array.isArray(options?.align) &&
    options.align.length !== drawUnits.length
  ) {
    throw new Error('invalid align parameter in verticalMerge');
  }

  const d3Elem = d3.create('svg:g');

  const n = drawUnits.length;

  const innerHeight = drawUnits.reduce(
    (acc, item) => acc + (item.verticalEnd - item.verticalStart),
    0
  );
  const topOuter = n > 0 && drawUnits[0].verticalStart > 0 ? drawUnits[0].verticalStart : 0;
  const bottomOuter =
    n > 0 && drawUnits[n - 1].herizontalEnd < drawUnits[n - 1].height
      ? drawUnits[n - 1].height - drawUnits[n - 1].herizontalEnd
      : 0;

  let maxLeftOuter = 0;
  let maxRightOuter = 0;

  const baseline: Alignment[] = options && Array.isArray(options?.align) ? options.align : [];

  if (!Array.isArray(options?.align)) {
    for (let i = 0; i < n; i++) {
      baseline.push(options?.align ? options.align : 'start');
    }
  }

  for (let i = 0; i < n; i++) {
    const unit = drawUnits[i];
    const align = baseline[i];

    switch (align) {
      case 'start': {
        maxLeftOuter = Math.max(maxLeftOuter, unit.herizontalStart);
        maxRightOuter = Math.max(maxRightOuter, unit.width - unit.herizontalStart);
        break;
      }
      case 'center': {
        maxLeftOuter = Math.max(maxLeftOuter, unit.herizontalCenter);
        maxRightOuter = Math.max(maxRightOuter, unit.width - unit.herizontalCenter);
        break;
      }
      case 'end': {
        maxLeftOuter = Math.max(maxLeftOuter, unit.herizontalEnd);
        maxRightOuter = Math.max(maxRightOuter, unit.width - unit.herizontalEnd);
        break;
      }
      default: {
        break;
      }
    }
  }

  const width = maxLeftOuter + maxRightOuter;
  const height = innerHeight + topOuter + bottomOuter;

  const childrenContainer = d3Elem.append('g');

  let yStack = topOuter;

  for (let i = 0; i < n; i++) {
    const unit = drawUnits[i];
    const align = baseline[i];

    let xMovementAmount = 0;

    switch (align) {
      case 'start': {
        xMovementAmount = unit.herizontalStart;
        break;
      }
      case 'center': {
        xMovementAmount = unit.herizontalCenter;
        break;
      }
      case 'end': {
        xMovementAmount = unit.herizontalEnd;
        break;
      }
      default: {
        break;
      }
    }

    childrenContainer
      .append(() => unit.element.node())
      .attr(
        'transform',
        `translate(${maxLeftOuter - xMovementAmount}, ${yStack - unit.verticalStart})`
      );

    yStack += unit.verticalEnd - unit.verticalStart;
  }

  return {
    width: options?.width !== undefined ? options.width : width,
    height: options?.height !== undefined ? options.height : height,
    element: d3Elem,
    verticalStart: options?.verticalStart !== undefined ? options.verticalStart : topOuter,
    verticalCenter:
      options?.verticalCenter !== undefined
        ? options.verticalCenter
        : topOuter + (height - topOuter) / 2,
    verticalEnd: options?.verticalEnd !== undefined ? options.verticalEnd : height,
    herizontalStart: options?.herizontalStart !== undefined ? options.herizontalStart : 0,
    herizontalCenter:
      options?.herizontalCenter !== undefined ? options.herizontalCenter : maxLeftOuter,
    herizontalEnd: options?.herizontalEnd !== undefined ? options.herizontalEnd : width,
  };
}

export function herizontalMerge(drawUnits: DrawUnit[], options?: MergeOptions): DrawUnit {
  if (
    options?.align &&
    Array.isArray(options?.align) &&
    options.align.length !== drawUnits.length
  ) {
    throw new Error('invalid align parameter in herizontal merge');
  }

  const d3Elem = d3.create('svg:g');

  const n = drawUnits.length;

  const innerWidth = drawUnits.reduce(
    (acc, item) => acc + (item.herizontalEnd - item.herizontalStart),
    0
  );
  const leftOuter = n > 0 && drawUnits[0].herizontalStart > 0 ? drawUnits[0].herizontalStart : 0;
  const rightOuter =
    n > 0 && drawUnits[n - 1].herizontalEnd < drawUnits[n - 1].width
      ? drawUnits[n - 1].width - drawUnits[n - 1].herizontalEnd
      : 0;

  let maxTopOuter = 0;
  let maxBottomOuter = 0;

  const baseline: Alignment[] = options && Array.isArray(options?.align) ? options.align : [];

  if (!Array.isArray(options?.align)) {
    for (let i = 0; i < n; i++) {
      baseline.push(options?.align ? options.align : 'start');
    }
  }

  for (let i = 0; i < n; i++) {
    const unit = drawUnits[i];
    const align = baseline[i];

    switch (align) {
      case 'start': {
        maxTopOuter = Math.max(maxTopOuter, unit.verticalStart);
        maxBottomOuter = Math.max(maxBottomOuter, unit.height - unit.verticalStart);
        break;
      }
      case 'center': {
        maxTopOuter = Math.max(maxTopOuter, unit.verticalCenter);
        maxBottomOuter = Math.max(maxBottomOuter, unit.height - unit.verticalCenter);
        break;
      }
      case 'end': {
        maxTopOuter = Math.max(maxTopOuter, unit.verticalEnd);
        maxBottomOuter = Math.max(maxBottomOuter, unit.height - unit.verticalEnd);
        break;
      }
      default: {
        break;
      }
    }
  }

  const width = innerWidth + leftOuter + rightOuter;
  const height = maxTopOuter + maxBottomOuter;

  const childrenContainer = d3Elem.append('g');

  let xStack = leftOuter;

  for (let i = 0; i < n; i++) {
    const unit = drawUnits[i];
    const align = baseline[i];

    let yMovementAmount = 0;

    switch (align) {
      case 'start': {
        yMovementAmount = unit.verticalStart;
        break;
      }
      case 'center': {
        yMovementAmount = unit.verticalCenter;
        break;
      }
      case 'end': {
        yMovementAmount = unit.verticalEnd;
        break;
      }
      default: {
        break;
      }
    }

    childrenContainer
      .append(() => unit.element.node())
      .attr(
        'transform',
        `translate(${xStack - unit.herizontalStart}, ${maxTopOuter - yMovementAmount})`
      );

    xStack += unit.herizontalEnd - unit.herizontalStart;
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart: options?.verticalStart !== undefined ? options.verticalStart : 0,
    verticalCenter: options?.verticalCenter !== undefined ? options.verticalCenter : maxTopOuter,
    verticalEnd: options?.verticalEnd !== undefined ? options.verticalEnd : height,
    herizontalStart: options?.herizontalStart !== undefined ? options.herizontalStart : leftOuter,
    herizontalCenter:
      options?.herizontalCenter !== undefined
        ? options.herizontalCenter
        : leftOuter + (width - leftOuter) / 2,
    herizontalEnd: options?.herizontalEnd ? options.herizontalEnd : width,
  };
}
