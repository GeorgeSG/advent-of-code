import { head, last, sum } from 'ramda';
import { readFile } from '~utils/core';

type Histogram = number[];
type Input = Histogram[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(' ').map(Number));
}

function getHistory(histogram: Histogram) {
  let currentValues = histogram;
  let result = [currentValues];

  while (currentValues.some((value) => value !== 0)) {
    currentValues = currentValues.reduce((acc, value, index) => {
      if (index < currentValues.length - 1) {
        acc[index] = currentValues[index + 1] - value;
      }
      return acc;
    }, []);

    result.push(currentValues);
  }

  return result;
}
// ---- Part A ----
export function partA(input: Input): number {
  return sum(input.flatMap((histogram) => getHistory(histogram).map(last<number>)));
}

// ---- Part B ----
export function partB(input: Input): number {
  const histories = input.map((histogram) =>
    getHistory(histogram)
      .map(head<number>)
      .reverse()
  );

  return sum(histories.map((history) => history.reduce((acc, value) => value - acc, 0)));
}
