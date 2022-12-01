import R from 'ramda';
import { findMax, sortNums } from '~utils/arrays';
import { readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = string[];

export function prepareInput(inputFile: string): Input {
  return readFileRaw(inputFile).split('\n');
}

const caloriesPerElf = (input: Input) => R.splitWhenever(R.equals(NaN), input.map(toI)).map(R.sum);

// ---- Part A ----
export function partA(input: Input) {
  return findMax(caloriesPerElf(input));
}

// ---- Part B ----
export function partB(input: Input) {
  return R.sum(sortNums(caloriesPerElf(input), true).slice(0, 3));
}
