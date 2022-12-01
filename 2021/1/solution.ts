import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = number[];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, toI);
}

export function partA(input: Input): number {
  let result = 0;

  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      result += 1;
    }
  }

  return result;
}

export function partB(input: Input): number {
  let result = 0;
  let windows: number[] = [];

  for (let i = 0; i < input.length - 2; i++) {
    windows[i] = input[i] + input[i + 1] + input[i + 2];
    if (i > 0 && windows[i] > windows[i - 1]) {
      result++;
    }
  }

  return result;
}
