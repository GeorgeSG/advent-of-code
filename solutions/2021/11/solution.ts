import R from 'ramda';
import { debug2D, ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { findAdjacentAll, Point2D } from '~utils/points';

type Input = number[][];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split('').map(toI));
}

const step = (map: Input) => {
  let flashes = 0;
  const flashed: Point2D[] = [];
  let toFlash: Point2D[] = [];

  ijMeBro(map, (x, y) => {
    map[x][y] += 1;
    if (map[x][y] > 9) {
      toFlash.push({ x, y });
    }
  });

  while (toFlash.length) {
    const newToFlash = [];

    toFlash.forEach((point) => {
      flashed.push(point);
      flashes += 1;

      R.without(newToFlash, findAdjacentAll(point, map)).forEach((adjPoint) => {
        const { x, y } = adjPoint;
        map[x][y] += 1;
        if (map[x][y] > 9) {
          newToFlash.push(adjPoint);
        }
      });
    });

    toFlash = R.without(flashed, newToFlash);
  }

  flashed.forEach(({ x, y }) => (map[x][y] = 0));

  return flashes;
};

// ---- Part A ----
export function partA(input: Input) {
  return R.sum(R.range(0, 100).map(() => step(input)));
}

// ---- Part B ----
export function partB(input: Input) {
  const allZeroes = () => input.flat().every((val) => val === 0);

  let stepCount = 0;
  while (!allZeroes()) {
    stepCount += 1;
    step(input);
  }
  return stepCount;
}
