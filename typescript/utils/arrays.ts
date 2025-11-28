import R from 'ramda';
import { numberCompare } from './numbers';
import { SortDirection } from './types';

export const findMax = (array: number[]): number => R.apply(Math.max, array);
export const findMin = (array: number[]): number => R.apply(Math.min, array);
export const findMinMax = (array: number[]): [number, number] => {
  const sorted = array.sort(numberCompare());
  return [sorted[0], sorted[sorted.length - 1]];
};

export const permutations = <T>(arr: T[]): T[][] =>
  arr.flatMap((v, i) => arr.slice(i + 1).map((w) => [v, w]));

export const intersectAll = <T>(arrays: T[][]) =>
  R.reduce<T[], T[]>(R.intersection, arrays[0], arrays);

export const sortNums = (array: number[], direction: SortDirection = SortDirection.ASC): number[] =>
  array.sort(numberCompare(direction));

export const sumArrays = (array1: number[], array2: number[]): number[] =>
  R.map(R.sum, R.zip(array1, array2));

export const ijMeBro = <T>(array: T[][], callback: (i: number, j: number, el: T) => void) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      callback(i, j, array[i][j]);
    }
  }
};

export const debug2D = <T>(array: T[][], separator = '', indicators = false, padEnd = 2) => {
  const printRow = (row) => row.map((el) => `${el}`.padEnd(padEnd)).join(separator);

  if (indicators) {
    const colCount = array[0].length;
    console.log(`    ${printRow(R.range(0, colCount))}`);
    console.log(`    ${printRow(R.range(0, colCount).map(() => '-'))}`);
  }
  array.forEach((row, rowIndex) => console.log(`${rowIndex} | ${printRow(row)}`));
  console.log('');
};
