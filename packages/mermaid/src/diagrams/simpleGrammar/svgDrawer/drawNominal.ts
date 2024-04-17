import type { DrawUnit, GraphicalNode } from '../simpleGrammarTypes.js';

import { emptyWord } from '../constants.js';
import { drawWord } from '../svgDrawer/drawWord.js';
import { drawEmptyLine } from './drawEmptyLine.js';
import { horizontalMerge, verticalMerge } from './utils.js';
import { drawEmpty } from './drawEmpty.js';
import { adjectiveKey, getKeyFromNode } from '../syntacticParser/keys.js';

export const drawNominal = ({
  topKeys,
  bottomKeys,
  children,
  isNominal,
}: {
  topKeys: string[];
  bottomKeys: string[];
  children: GraphicalNode[];
  isNominal: boolean;
}): DrawUnit => {
  const topDrawUnits: DrawUnit[] = [];
  const bottomDrawUnits: DrawUnit[] = [];

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];

    if (topKeys.includes(getKeyFromNode(child))) {
      if (getKeyFromNode(child) === adjectiveKey) {
        topDrawUnits.push(drawWord(child));
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
    topDrawUnits.push(isNominal ? drawWord(emptyWord) : drawEmptyLine());
  }

  const topDrawUnit = horizontalMerge(topDrawUnits, { align: 'end' });
  const bottomDrawUnit = horizontalMerge(bottomDrawUnits, { align: 'start' });

  const line = drawEmptyLine(Math.max(topDrawUnit.width, bottomDrawUnit.width));

  return verticalMerge(
    [verticalMerge([topDrawUnit, line], { align: 'center' }), bottomDrawUnit],
    {
      align: 'end',
      verticalCenter: topDrawUnit.height,
    },
  );
};
