import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import R from 'ramda';

type Input = number[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => toI(line));
}

const calcFuel = (mass: number) => Math.floor(mass / 3) - 2;

// ---- Part A ----
export function partA(input: Input): number {
  return R.sum(input.map(calcFuel));
}

// ---- Part B ----
export function partB(input: Input): number {
  return R.sum(
    input.map((mass) => {
      let res = 0;
      let fuel = calcFuel(mass);
      while (calcFuel(fuel) > 0) {
        res += fuel;
        fuel = calcFuel(fuel);
      }
      return res + fuel;
    })
  );
}
