import R from 'ramda';

export const findMax = (array: number[]): number => R.apply(Math.max, array);

export const sortNums = (array: number[], inverted = false): number[] =>
  array.sort((a, b) => (inverted ? b - a : a - b));

export const ijMeBro = <T>(array: T[][], callback: (i: number, j: number, el: T) => void) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      callback(i, j, array[i][j]);
    }
  }
};

export const debug2D = <T>(array: T[][]) => {
  array.forEach((row) => console.log(row.join('')));
  console.log('');
};
