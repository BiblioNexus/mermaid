import * as d3 from 'd3';

import type { D3Element, DrawUnit, StatusType } from '../simpleGrammarTypes.js';
import { settings } from '../settings.js';
import { ruler } from '../utils.js';

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
  special?: boolean;
};

export function verticalMergeNormal(
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

  let topOuter = 0;
  let bottomOuter = 0;
  let stackTop = 0;
  let stackBottom = 0;

  for (let i = 0; i < n; i++) {
    topOuter = Math.max(topOuter, drawUnits[i].verticalStart - stackTop);
    bottomOuter = Math.max(
      bottomOuter,
      drawUnits[n - i - 1].height -
        drawUnits[n - i - 1].verticalEnd -
        stackBottom,
    );

    stackTop += drawUnits[i].verticalEnd - drawUnits[i].verticalStart;
    stackBottom +=
      drawUnits[n - i - 1].verticalEnd - drawUnits[n - i - 1].verticalStart;
  }

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
      options?.verticalEnd !== undefined
        ? options.verticalEnd
        : height - bottomOuter,
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

export function verticalMergeSpecial(
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

  const height = drawUnits.reduce((acc, item) => acc + item.height, 0);
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

  const childrenContainer = d3Elem.append('g');

  let yStack = 0;

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
        `translate(${maxLeftOuter - xMovementAmount}, ${yStack})`,
      );

    yStack += unit.height;
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
      options?.verticalEnd !== undefined
        ? options.verticalEnd
        : height - bottomOuter,
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

export function verticalMerge(
  drawUnits: DrawUnit[],
  options?: MergeOptions,
): DrawUnit {
  return options?.special
    ? verticalMergeSpecial(drawUnits, options)
    : verticalMergeNormal(drawUnits, options);
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

  const width = drawUnits.reduce((acc, item) => acc + item.width, 0);
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

  const height = maxTopOuter + maxBottomOuter;

  const childrenContainer = d3Elem.append('g');

  let xStack = 0;

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
        `translate(${xStack}, ${maxTopOuter - yMovementAmount})`,
      );

    xStack += unit.width;
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
        : leftOuter + (width - leftOuter - rightOuter) / 2,
    horizontalEnd: options?.horizontalEnd
      ? options.horizontalEnd
      : width - rightOuter,
  };
}

export function getHebrew({
  status,
  hebrew,
}: {
  status?: StatusType;
  hebrew: string;
}) {
  if (status === 'elided') {
    return hebrew.trim() !== '( )' ? '( )' : `( ${hebrew} )`;
  }

  return hebrew;
}

export function getColorByStatus({
  status,
  defaultColor,
  type,
}: {
  status?: StatusType;
  type: 'line' | 'hebrew' | 'gloss';
  defaultColor: string;
}) {
  if (status === undefined) {
    return defaultColor;
  }

  if (status === 'elided') {
    return settings.elidedColor;
  }

  if (status === 'alternative') {
    return settings.alternativeColor;
  }

  if (status === 'emendation' && type === 'hebrew') {
    return settings.emendationColor;
  }

  if (status === 'revocalization') {
    return settings.revocalizationColor;
  }

  return defaultColor;
}

export function drawGloss(gloss: string, color: string): D3Element {
  const d3Elem = d3.create('svg:g');

  const parts = gloss.split('>>');

  if (parts.length === 2) {
    const reversed = parts[0].includes('*');

    const rect1 = ruler(
      `${parts[0].replace('*', '')}${reversed ? '' : ' >> '}`,
    );

    d3Elem
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('stroke', reversed ? color : 'none')
      .attr('fill', color)
      .text(`${parts[0].replace('*', '')}${reversed ? '' : ' >> '}`);
    d3Elem
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('stroke', !reversed ? color : 'none')
      .attr('fill', color)
      .text(`${!reversed ? '' : ' >> '}${parts[0].replace('*', '')}`)
      .attr('transform', `translate(${rect1.width}, 0)`);
  } else {
    d3Elem
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('stroke', color)
      .attr('fill', color)
      .text(gloss);
  }

  return d3Elem;
}
