import R from 'ramda';
import { sortNums } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { fromArray, Point2D, toKey } from '~utils/points';

type Input = {
  blocked: Set<string>;
  bottom: number;
  isBlocked(pos: Point2D): boolean;
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
    isBlocked: (pos: Point2D) => blocked.has(toKey(pos)),
  };
}

const CAVE_TOP = { x: 0, y: 500 };
const GRAIN_MOVES = [
  [1, 0],
  [1, -1],
  [1, 1],
];

// Returns true if there's space for more sand
function simulateGrain({ blocked, bottom, isBlocked }: Input): boolean {
  let grain = CAVE_TOP;

  while (!isBlocked(grain)) {
    const next: Point2D | undefined = GRAIN_MOVES.map(([x, y]) => ({
      x: grain.x + x,
      y: grain.y + y,
    })).find((pos) => !isBlocked(pos));

    if (next) {
      if (next.x === bottom) return false; // sand is falling outside the map
      grain = next;
    } else {
      if (R.equals(grain, CAVE_TOP)) return false; // sand reached cave top
      blocked.add(toKey(grain));
    }
  }

  return true;
}

function simulateSandfall(input: Input): number {
  let fallen = 0;
  while (simulateGrain(input)) fallen += 1;

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
    isBlocked: (pos: Point2D) => pos.x === input.bottom || input.blocked.has(toKey(pos)),
  };

  return simulateSandfall(input) + 1;
}
