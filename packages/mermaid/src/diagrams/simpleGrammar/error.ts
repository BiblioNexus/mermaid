export type ErrorType = 'InvalidStructure' | 'InvalidChildren' | 'InvalidParser' | 'InvalidNode';

export class GrammarError extends Error {
  constructor(errorType: ErrorType, msg: string) {
    super(`${errorType}: ${msg}`);
  }
}
