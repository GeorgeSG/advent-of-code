import R from 'ramda';
import { readFile } from '~utils/core';
import { numberCompare } from '~utils/numbers';
import { SortDirection } from '~utils/types';

type Input = any[];

// Parser
export function prepareInput(inputFile: string): Input {
  return R.splitEvery<string>(2, readFile(inputFile)).map(([left, right]) => [
    JSON.parse(left),
    JSON.parse(right),
  ]);
}

const isNumber = (val: unknown): val is number => typeof val === 'number';

function compare(left: any[] | number, right: any[] | number): number {
  if (isNumber(left) && isNumber(right)) {
    return numberCompare(SortDirection.DESC)(left, right);
  }

  if (isNumber(left)) left = [left];
  if (isNumber(right)) right = [right];

  for (let i = 0; i < left.length; i++) {
    if (right[i] === undefined) return -1;

    const cmp = compare(left[i], right[i]);
    if (cmp) return cmp;
  }

  return left.length === right.length ? 0 : 1;
}

// ---- Part A ----
export function partA(input: Input): number {
  return input.reduce((sum, [left, right], i) => (compare(left, right) > 0 ? sum + i + 1 : sum), 0);
}

// ---- Part B ----
export function partB(input: Input): number {
  const dividers = [[[2]], [[6]]];
  const sortedPackets = input
    .flat()
    .concat(dividers)
    .sort((packetA, packetB) => -1 * compare(packetA, packetB))
    .map((packet) => JSON.stringify(packet));

  const dividerPositions = dividers.map(
    (divider) => sortedPackets.findIndex((packet) => packet === JSON.stringify(divider)) + 1
  );

  return R.product(dividerPositions);
}
