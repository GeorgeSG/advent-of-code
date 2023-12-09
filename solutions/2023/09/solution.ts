import { head, last, sum, until } from 'ramda';
import { readFile } from '~utils/core';

type Histogram = number[];
type Input = Histogram[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(' ').map(Number));
}

function getHistory(histogram: Histogram): Histogram[] {
  let history = [];

  until<Histogram, Histogram>(
    (currentHistogram) => currentHistogram.every((value) => value === 0),
    (currentHistogram) => {
      const currentValues = currentHistogram.reduce((acc, value, index) => {
        if (index < currentHistogram.length - 1) {
          acc[index] = currentHistogram[index + 1] - value;
        }
        return acc;
      }, []);
      history.push(currentValues);
      return currentValues;
    }
  )(histogram);

  return [histogram, ...history];
}
// ---- Part A ----
export function partA(input: Input): number {
  return sum(input.flatMap((histogram) => getHistory(histogram).map<number>(last)));
}

// ---- Part B ----
export function partB(input: Input): number {
  const histories = input.map((histogram) => getHistory(histogram).map<number>(head).reverse());

  return sum(histories.map((history) => history.reduce((acc, value) => value - acc, 0)));
}
