import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Pair = [[number, number], [number, number]];
type Input = Pair[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) =>
    line
      .split(',')
      .map((elf) => elf.split('-').map(toI))
      .sort((a, b) => (a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]))
  );
}

// ---- Part A ----
export function partA(input: Input): number {
  return input.filter(([a, b]) => a[1] >= b[1]).length;
}

// ---- Part B ----
export function partB(input: Input): number {
  return input.filter(([a, b]) => a[1] >= b[0]).length;
}
