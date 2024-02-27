import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'simple-grammar';

const detector: DiagramDetector = (txt) => {
  return /^\s*SimpleGrammar/.test(txt);
};

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./simpleGrammarDiagram.js');
  return { id, diagram };
};

export const simpleGrammar: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};
