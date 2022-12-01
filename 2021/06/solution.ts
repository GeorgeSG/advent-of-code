import { sum } from 'ramda';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = number[];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(',').map(toI))[0];
}

function solve(input: Input, days: number) {
  let fishes = input;
  let fishesAtDay = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  fishes.map((f) => {
    fishesAtDay[f] = fishesAtDay[f] + 1;
  });

  for (let i = 0; i < days; i++) {
    let fishesToAdd = 0;
    for (let day = 0; day <= 8; day++) {
      const fishes = fishesAtDay[day];
      if (day !== 0) {
        fishesAtDay[day - 1] += fishes;
        fishesAtDay[day] = 0;
      } else {
        fishesToAdd = fishes;
        fishesAtDay[0] = 0;
      }
    }
    fishesAtDay[6] += fishesToAdd;
    fishesAtDay[8] = fishesToAdd;
  }

  return sum(fishesAtDay);
}

// ---- Part A ----
export function partA(input: Input) {
  return solve(input, 80);
}

// ---- Part B ----
export function partB(input: Input) {
  return solve(input, 256);
}
