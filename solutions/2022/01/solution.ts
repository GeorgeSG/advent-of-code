import R from 'ramda';
import { findMax, sortNums } from '~utils/arrays';
import { readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';
import { SortDirection } from '~utils/types';

type Input = string[];

export function prepareInput(inputFile: string): Input {
  return readFileRaw(inputFile).split('\n');
}

const caloriesPerElf = (input: Input) => R.splitWhenever(R.equals(NaN), input.map(toI)).map(R.sum);

// ---- Part A ----
export function partA(input: Input): number {
  return findMax(caloriesPerElf(input));
}

// ---- Part B ----
export function partB(input: Input): number {
  return R.sum(sortNums(caloriesPerElf(input), SortDirection.DESC).slice(0, 3));
}
