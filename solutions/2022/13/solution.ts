import R from 'ramda';
import { readFile } from '~utils/core';

type Input = any[];

// Parser
export function prepareInput(inputFile: string): Input {
  return R.splitEvery(
    2,
    readFile(inputFile).map((file) => JSON.parse(file))
  );
}

const isNumber = (val: unknown): val is number => typeof val === 'number';

function compare(left: any[] | number, right: any[] | number): number {
  if (isNumber(left) && isNumber(right)) return right - left;

  if (isNumber(left)) left = [left];
  if (isNumber(right)) right = [right];

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const cmp = compare(left[i], right[i]);
    if (cmp) return cmp;
  }

  return right.length - left.length;
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
    .sort((packetA, packetB) => -1 * compare(packetA, packetB));

  // const dividerPositions = dividers.map(
  //   (divider) => R.findIndex(R.equals(divider), sortedPackets) + 1
  // );

  const getIndexes = (divider) => R.pipe(R.findIndex(R.equals(divider)), R.add(1))(sortedPackets);
  return R.product(R.map(getIndexes, dividers));
}
