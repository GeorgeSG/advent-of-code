import R from 'ramda';

export const findMax = (array: number[]): number => R.apply(Math.max, array);
