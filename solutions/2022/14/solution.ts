import R from 'ramda';
import { sortNums } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { fromArray, Point2D, toKey } from '~utils/points';

type Input = {
  blocked: Set<string>;
  bottom: number;
  isBlocked(point: Point2D): boolean;
};

// Parser
export function prepareInput(inputFile: string): Input {
  const blocked = new Set<string>();
  let bottom = 0;

  const walls: Point2D[][] = readFile(inputFile, (line) =>
    line.split(' -> ').map((l) => fromArray(l.split(',').map(toI)))
  );

  walls.forEach((wallCoords) => {
    for (let i = 0; i < wallCoords.length - 1; i++) {
      const [{ x, y }, to] = [wallCoords[i], wallCoords[i + 1]];

      const [minX, maxX] = sortNums([x, to.x]);
      const [minY, maxY] = sortNums([y, to.y]);
      const range = x === to.x ? R.range(minY, maxY + 1) : R.range(minX, maxX + 1);

      if (bottom < maxY) bottom = maxY;

      range
        // x and y are reversed in the input, swap them
        .map((n) => (x === to.x ? { x: n, y: x } : { y: n, x: y }))
        .forEach((wallPoint) => blocked.add(toKey(wallPoint)));
    }
  });

  return {
    blocked,
    bottom,
    isBlocked: (coord: Point2D) => blocked.has(toKey(coord)),
  };
}

const START = { x: 0, y: 500 };
function sandFall({ blocked, isBlocked, bottom }: Input) {
  const moves = [
    [1, 0],
    [1, -1],
    [1, 1],
  ];

  let current = START;

  while (!isBlocked(current)) {
    const next: Point2D | undefined = moves
      .map(([moveX, moveY]) => ({ x: current.x + moveX, y: current.y + moveY }))
      .find((point) => !isBlocked(point));

    if (next) {
      current = next;
      if (current.x > bottom) return false;
    } else {
      blocked.add(toKey(current));
      if (R.equals(current, START)) return false;
    }
  }

  return true;
}

function simulateSandfall(input: Input): number {
  let fallen = 0;
  while (sandFall(input)) fallen += 1;

  return fallen;
}

// ---- Part A ----
export function partA(input: Input): number {
  return simulateSandfall(input);
}

// ---- Part B ----
export function partB({ blocked, bottom }: Input): number {
  const input = {
    blocked,
    bottom: bottom + 2,
    isBlocked: (coord: Point2D) => coord.x === input.bottom || input.blocked.has(toKey(coord)),
  };

  return simulateSandfall(input) + 1;
}
