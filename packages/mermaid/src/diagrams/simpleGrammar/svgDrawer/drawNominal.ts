import type {
  DrawUnit,
  GraphicalNode,
  StatusType,
} from '../simpleGrammarTypes.js';

import { emptyWord } from '../constants.js';
import { drawWord } from '../svgDrawer/drawWord.js';
import { drawEmptyLine } from './drawEmptyLine.js';
import { horizontalMerge, verticalMerge } from './utils.js';
import { drawEmpty } from './drawEmpty.js';
import {
  adjectiveKey,
  getKeyFromNode,
  verbparticipleKey,
} from '../syntacticParser/keys.js';

export const drawNominal = ({
  topKeys,
  bottomKeys,
  children,
  isNominal,
  status,
  message,
}: {
  topKeys: string[];
  bottomKeys: string[];
  children: GraphicalNode[];
  isNominal: boolean;
  status?: StatusType;
  message?: string;
}): DrawUnit => {
  const topDrawUnits: DrawUnit[] = [];
  const bottomDrawUnits: DrawUnit[] = [];

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];

    if (topKeys.includes(getKeyFromNode(child))) {
      if (
        getKeyFromNode(child) === adjectiveKey ||
        (getKeyFromNode(child) === verbparticipleKey &&
          message === 'adjectival > nominal')
      ) {
        topDrawUnits.push(drawWord(child, { status: child.status }));
      } else {
        topDrawUnits.push(child.drawUnit);
      }
    }

    if (bottomKeys.includes(getKeyFromNode(child))) {
      bottomDrawUnits.push(child.drawUnit);
    }
  }

  if (topDrawUnits.length === 0 && bottomDrawUnits.length === 0) {
    return drawEmpty();
  }

  if (topDrawUnits.length === 0) {
    topDrawUnits.push(
      isNominal ? drawWord(emptyWord, { status }) : drawEmptyLine({ status }),
    );
  }

  const topDrawUnit = horizontalMerge(topDrawUnits, { align: 'end' });
  const bottomDrawUnit = horizontalMerge(bottomDrawUnits, { align: 'start' });

  const line = drawEmptyLine({
    lineWidth: Math.max(topDrawUnit.width, bottomDrawUnit.width),
    status,
  });

  return verticalMerge(
    [
      verticalMerge(
        [line, { ...topDrawUnit, verticalStart: topDrawUnit.verticalEnd }],
        {
          align: 'center',
          verticalStart: topDrawUnit.verticalStart,
          verticalCenter: topDrawUnit.verticalCenter,
          verticalEnd: topDrawUnit.verticalEnd,
        },
      ),
      bottomDrawUnit,
    ],
    {
      align: 'end',
      verticalCenter: topDrawUnit.height,
    },
  );
};
