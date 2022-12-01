import R from 'ramda';

export const findMax = (array: number[]): number => R.apply(Math.max, array);

export const sortNums = (array: number[]): number[] => array.sort((a, b) => a - b);
