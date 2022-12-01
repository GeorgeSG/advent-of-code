import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = number[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, toI);
}

// ---- Part A ----
export function partA(input: Input) {
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      if (input[i] + input[j] === 2020) {
        return input[i] * input[j];
      }
    }
  }

  return 0;
}

// ---- Part B ----
export function partB(input: Input) {
  for (let i = 0; i < input.length - 2; i++) {
    for (let j = i + 1; j < input.length - 1; j++) {
      for (let x = j + 1; x < input.length; x++) {
        if (input[i] + input[j] + input[x] === 2020) {
          return input[i] * input[j] * input[x];
        }
      }
    }
  }

  return 0;
}
