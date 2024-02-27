export enum ErrorType {
  InvalidStructure = 'InvalidStructure',
  InvalidChildren = 'InvalidChildren',
  InvalidParser = 'InvalidParser',
}

export class GrammarError extends Error {
  constructor(errorType: ErrorType, msg: string) {
    super(`${errorType}: ${msg}`);
  }
}