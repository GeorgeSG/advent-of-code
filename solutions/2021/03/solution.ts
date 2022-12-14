import { sum } from 'ramda';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = number[][];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line: string) => line.split('').map(toI));
}

function mostCommonAt(index: number, input: Input) {
  const totalInputs = input.length;
  const ones = sum(input.map((l) => l[index]));
  if (ones === totalInputs / 2) {
    return -1;
  }
  return ones > totalInputs / 2 ? 1 : 0;
}

export function partA(input: Input): number {
  const gamma = [];
  const epsilon = [];

  for (let i = 0; i < input[0].length; i++) {
    const mostCommonAtI = mostCommonAt(i, input);

    gamma.push(mostCommonAtI === 1 ? 1 : 0);
    epsilon.push(mostCommonAtI === 0 ? 1 : 0);
  }

  const gammaRate = parseInt(gamma.join(''), 2);
  const epsilonRate = parseInt(epsilon.join(''), 2);

  return gammaRate * epsilonRate;
}

export function partB(input: Input): number {
  let oxygen = input;
  let co2 = input;

  for (let i = 0; i < input[0].length; i++) {
    if (oxygen.length === 1 && co2.length === 1) {
      break;
    }

    if (oxygen.length > 1) {
      const mostCommonAtI = mostCommonAt(i, oxygen);
      const oxygenFilter = mostCommonAtI === -1 ? 1 : mostCommonAtI;
      oxygen = oxygen.filter((num) => num[i] === oxygenFilter);
    }

    if (co2.length > 1) {
      const mostCommonAtI = mostCommonAt(i, co2);
      const co2Filter = mostCommonAtI === -1 ? 0 : mostCommonAtI ? 0 : 1; // invert 1 <-> 0
      co2 = co2.filter((num) => num[i] === co2Filter);
    }
  }

  const oxygenRate = parseInt(oxygen[0].join(''), 2);
  const co2Rate = parseInt(co2[0].join(''), 2);

  return oxygenRate * co2Rate;
}
