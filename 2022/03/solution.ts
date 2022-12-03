import R from 'ramda';
import { intersectAll } from '~utils/arrays';
import { readFile } from '~utils/core';

type Input = string[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).map((line) => line.split(''));
}

function itemPriority(item: string): number {
  const code = item.charCodeAt(0);
  return code > 96 ? code - 96 : code - 38; // a-z: 0-26, A-Z: 27-52
}

// ---- Part A ----
export function partA(input: Input): number {
  return R.sum(
    input.map((sack) => itemPriority(R.intersection(...R.splitAt(sack.length / 2, sack))[0]))
  );
}

// ---- Part B ----
export function partB(input: Input): number {
  return R.sum(R.splitEvery(3, input).map((group) => itemPriority(intersectAll(group)[0])));
}
