import R from 'ramda';

export const findMax = (array: number[]): number => R.apply(Math.max, array);

export const sortNums = (array: number[], inverted = false): number[] =>
  array.sort((a, b) => (inverted ? b - a : a - b));
