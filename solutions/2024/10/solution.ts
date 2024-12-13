import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';

type Input = Map2D<number>;

// Parser
export function prepareInput(inputFile: string): Input {
  return new Map2D(readFile(inputFile, (line) => line.split('').map(Number)));
}

const getTrailEnds = (map: Map2D<number>, point: Point) => {
  const queue = [point];
  const trailEnds = [];

  while (queue.length) {
    const current = queue.shift();
    const height = map.get(current);

    if (height === 9) {
      trailEnds.push(current.toKey());
      continue;
    }

    const neighbours = map
      .findAdjacent(current)
      .filter((neighbour) => map.get(neighbour) === height + 1);

    queue.push(...neighbours);
  }

  return trailEnds;
};

function getTotalScore(input: Input, scoreFn: (map: Map2D<number>, point: Point) => number) {
  return input.reduce(
    (score, point, value) => (value === 0 ? score + scoreFn(input, point) : score),
    0
  );
}

// ---- Part A ----
export function partA(input: Input): number {
  return getTotalScore(input, (map, point) => new Set(getTrailEnds(map, point)).size);
}

// ---- Part B ----
export function partB(input: Input): number {
  return getTotalScore(input, (map, point) => getTrailEnds(map, point).length);
}
