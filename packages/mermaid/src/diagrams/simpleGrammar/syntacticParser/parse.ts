import { isFragment, isWord } from '../utils.js';

import { GrammarError } from '../error.js';

import type { GrammarNode, GraphicalNode } from '../simpleGrammarTypes.js';

import { drawWord } from '../svgDrawer/drawWord.js';
import { drawContainer } from '../svgDrawer/drawContainer.js';

import {
  adjectivalKey,
  adverbialKey,
  clauseKey,
  complementClauseKey,
  complementKey,
  constructchainKey,
  discourseunitKey,
  fragmentKey,
  generateFragmentKey,
  nominalKey,
  objectKey,
  predicateKey,
  prepositionFragmentKey,
  prepositionalPhraseKey,
  relativeClauseKey,
  relativeParticleKey,
  relativeKey,
  subjectKey,
  subordinateClauseKey,
  secondObjectKey,
  vocativeKey,
} from './keys.js';

import { settings } from '../settings.js';

import { parseConstructChain } from './parseConstructChain.js';
import { parseAdjectival } from './parseAdjectival.js';
import { parseFragment } from './parseFragment.js';
import { parseNominal } from './parseNominal.js';
import { parsePrepositionalPhrase } from './parsePrepositionalPhrase.js';
import { parseAdverbial } from './parseAdverbial.js';
import { parseClause } from './parseClause.js';
import { parseSubject } from './parseSubject.js';
import { parsePredicate } from './parsePredicate.js';
import { parseComplement } from './parseComplement.js';
import { parseComplementClauseClause } from './parseComplementClause.js';
import { parseObject } from './parseObject.js';
import { parseRelativeClause } from './parseRelativeClause.js';
import { parseSubordinateSubordinateClause } from './parseSubordinateClause.js';
import { parseRelative } from './parseRelative.js';
import { parseDiscourseUnit } from './parseDiscourseUnit.js';
import { parseRelativeParticle } from './parseRelativeParticle.js';
import { parsePreposition } from './parsePreposition.js';
import { parseVocative } from './parseVocative.js';

const parserMap: Record<string, (node: GrammarNode) => GraphicalNode> = {
  [discourseunitKey]: parseDiscourseUnit,
  [fragmentKey]: parseFragment,
  [prepositionFragmentKey]: parsePreposition,
  [nominalKey]: parseNominal,
  [constructchainKey]: parseConstructChain,
  [adjectivalKey]: parseAdjectival,
  [adverbialKey]: parseAdverbial,
  [clauseKey]: parseClause,
  [subjectKey]: parseSubject,
  [predicateKey]: parsePredicate,
  [complementKey]: parseComplement,
  [complementClauseKey]: parseComplementClauseClause,
  [prepositionalPhraseKey]: parsePrepositionalPhrase,
  [objectKey]: parseObject,
  [secondObjectKey]: parseObject,
  [relativeClauseKey]: parseRelativeClause,
  [relativeParticleKey]: parseRelativeParticle,
  [relativeKey]: parseRelative,
  [subordinateClauseKey]: parseSubordinateSubordinateClause,
  [vocativeKey]: parseVocative,
};

export function parse(node: GrammarNode): GraphicalNode {
  for (let i = 0; i < node.children.length; i++) {
    node.children[i] = parse(node.children[i]);
  }

  if (node.content === null) {
    return {
      ...node,
      drawUnit: drawContainer(node, 'Simple Grammar', settings.titleColor),
    };
  }

  if (isFragment(node.content)) {
    const key = generateFragmentKey(node.content.fragment);

    if (parserMap[key]) {
      return parserMap[key](node);
    } else {
      throw new GrammarError('InvalidStructure', 'Invalid structure, not defined parser');
    }
  }

  if (isWord(node.content)) {
    return {
      ...node,
      drawUnit: drawWord(node),
    };
  }

  throw new GrammarError('InvalidStructure', 'Invalid structure, not defined parser');
}
