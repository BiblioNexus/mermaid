export type ErrorType = 'InvalidStructure' | 'InvalidChildren' | 'InvalidParser' | 'InvalidNode';

export class GrammarError extends Error {
  errorType: ErrorType;

  constructor(errorType: ErrorType, msg: string) {
    super(`${errorType}: ${msg}`);
    this.errorType = errorType;
  }
}
