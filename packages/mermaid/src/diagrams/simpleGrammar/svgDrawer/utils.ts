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
  horizontalStart?: number;
  horizontalEnd?: number;
  horizontalCenter?: number;
};

export function verticalMerge(
  drawUnits: DrawUnit[],
  options?: MergeOptions,
): DrawUnit {
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
    0,
  );
  const topOuter =
    n > 0 && drawUnits[0].verticalStart > 0 ? drawUnits[0].verticalStart : 0;
  const bottomOuter =
    n > 0 && drawUnits[n - 1].horizontalEnd < drawUnits[n - 1].height
      ? drawUnits[n - 1].height - drawUnits[n - 1].horizontalEnd
      : 0;

  let maxLeftOuter = 0;
  let maxRightOuter = 0;

  const baseline: Alignment[] =
    options && Array.isArray(options?.align) ? options.align : [];

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
        maxLeftOuter = Math.max(maxLeftOuter, unit.horizontalStart);
        maxRightOuter = Math.max(
          maxRightOuter,
          unit.width - unit.horizontalStart,
        );
        break;
      }
      case 'center': {
        maxLeftOuter = Math.max(maxLeftOuter, unit.horizontalCenter);
        maxRightOuter = Math.max(
          maxRightOuter,
          unit.width - unit.horizontalCenter,
        );
        break;
      }
      case 'end': {
        maxLeftOuter = Math.max(maxLeftOuter, unit.horizontalEnd);
        maxRightOuter = Math.max(
          maxRightOuter,
          unit.width - unit.horizontalEnd,
        );
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
        xMovementAmount = unit.horizontalStart;
        break;
      }
      case 'center': {
        xMovementAmount = unit.horizontalCenter;
        break;
      }
      case 'end': {
        xMovementAmount = unit.horizontalEnd;
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
        `translate(${maxLeftOuter - xMovementAmount}, ${yStack - unit.verticalStart})`,
      );

    yStack += unit.verticalEnd - unit.verticalStart;
  }

  return {
    width: options?.width !== undefined ? options.width : width,
    height: options?.height !== undefined ? options.height : height,
    element: d3Elem,
    verticalStart:
      options?.verticalStart !== undefined ? options.verticalStart : topOuter,
    verticalCenter:
      options?.verticalCenter !== undefined
        ? options.verticalCenter
        : topOuter + (height - topOuter) / 2,
    verticalEnd:
      options?.verticalEnd !== undefined ? options.verticalEnd : height,
    horizontalStart:
      options?.horizontalStart !== undefined ? options.horizontalStart : 0,
    horizontalCenter:
      options?.horizontalCenter !== undefined
        ? options.horizontalCenter
        : maxLeftOuter,
    horizontalEnd:
      options?.horizontalEnd !== undefined ? options.horizontalEnd : width,
  };
}

export function horizontalMerge(
  drawUnits: DrawUnit[],
  options?: MergeOptions,
): DrawUnit {
  if (
    options?.align &&
    Array.isArray(options?.align) &&
    options.align.length !== drawUnits.length
  ) {
    throw new Error('invalid align parameter in horizontal merge');
  }

  const d3Elem = d3.create('svg:g');

  const n = drawUnits.length;

  const innerWidth = drawUnits.reduce(
    (acc, item) => acc + (item.horizontalEnd - item.horizontalStart),
    0,
  );
  const leftOuter =
    n > 0 && drawUnits[0].horizontalStart > 0
      ? drawUnits[0].horizontalStart
      : 0;
  const rightOuter =
    n > 0 && drawUnits[n - 1].horizontalEnd < drawUnits[n - 1].width
      ? drawUnits[n - 1].width - drawUnits[n - 1].horizontalEnd
      : 0;

  let maxTopOuter = 0;
  let maxBottomOuter = 0;

  const baseline: Alignment[] =
    options && Array.isArray(options?.align) ? options.align : [];

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
        maxBottomOuter = Math.max(
          maxBottomOuter,
          unit.height - unit.verticalStart,
        );
        break;
      }
      case 'center': {
        maxTopOuter = Math.max(maxTopOuter, unit.verticalCenter);
        maxBottomOuter = Math.max(
          maxBottomOuter,
          unit.height - unit.verticalCenter,
        );
        break;
      }
      case 'end': {
        maxTopOuter = Math.max(maxTopOuter, unit.verticalEnd);
        maxBottomOuter = Math.max(
          maxBottomOuter,
          unit.height - unit.verticalEnd,
        );
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
        `translate(${xStack - unit.horizontalStart}, ${maxTopOuter - yMovementAmount})`,
      );

    xStack += unit.horizontalEnd - unit.horizontalStart;
  }

  return {
    width,
    height,
    element: d3Elem,
    verticalStart:
      options?.verticalStart !== undefined ? options.verticalStart : 0,
    verticalCenter:
      options?.verticalCenter !== undefined
        ? options.verticalCenter
        : maxTopOuter,
    verticalEnd:
      options?.verticalEnd !== undefined ? options.verticalEnd : height,
    horizontalStart:
      options?.horizontalStart !== undefined
        ? options.horizontalStart
        : leftOuter,
    horizontalCenter:
      options?.horizontalCenter !== undefined
        ? options.horizontalCenter
        : leftOuter + (width - leftOuter) / 2,
    horizontalEnd: options?.horizontalEnd ? options.horizontalEnd : width,
  };
}
