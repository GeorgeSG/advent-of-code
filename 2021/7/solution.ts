import path from 'path';
import R from 'ramda';
import { findMax } from '~utils/arrays';
import { readFile, timeAndPrint } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = number[];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(',').map(toI))[0];
}

// ---- Part A ----
export function partA(input: Input) {
  const optimalPos = R.median(input);
  return R.sum(input.map((i) => Math.abs(optimalPos - i)));
}

// ---- Part B ----
export function partB(input: Input) {
  const max = findMax(input);

  let minFuel = Number.POSITIVE_INFINITY;

  // this will take a while xD. ~12secs
  for (let pos = 0; pos < max; pos++) {
    const fuelPerSub = input.map((i) => {
      const change = Math.abs(pos - i);
      return R.sum(R.range(1, change + 1));
    });

    const fuel = R.sum(fuelPerSub);
    if (minFuel > fuel) {
      minFuel = fuel;
    }
  }

  return minFuel;
}
