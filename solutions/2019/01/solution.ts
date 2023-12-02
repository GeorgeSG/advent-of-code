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
      let fuel = calcFuel(mass);
      let res = fuel;
      while (calcFuel(fuel) > 0) {
        fuel = calcFuel(fuel);
        res += fuel;
      }
      return res;
    })
  );
}
