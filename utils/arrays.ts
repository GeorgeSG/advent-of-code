import R from 'ramda';

export const findMax = (array: number[]): number => R.apply(Math.max, array);

export const intersectAll = <T>(arrays: T[][]) =>
  R.reduce<T[], T[]>(R.intersection, arrays[0], arrays);

export const sortNums = (array: number[], inverted = false): number[] =>
  array.sort((a, b) => (inverted ? b - a : a - b));

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
