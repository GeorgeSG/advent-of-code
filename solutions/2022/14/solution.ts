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
      const [from, to] = [wallCoords[i], wallCoords[i + 1]];
      if (bottom < to.y) bottom = to.y;

      const changingAxis = from.x === to.x ? 'y' : 'x';
      const [wallStart, wallEnd] = sortNums([from[changingAxis], to[changingAxis]]);

      R.range(wallStart, wallEnd + 1).forEach((wallPoint) =>
        blocked.add(toKey({ ...from, [changingAxis]: wallPoint }))
      );
    }
  });

  return {
    blocked,
    bottom,
    isBlocked: (pos: Point2D) => blocked.has(toKey(pos)),
  };
}

const CAVE_TOP = { x: 500, y: 0 };
const GRAIN_MOVES = [
  [0, 1],
  [-1, 1],
  [1, 1],
];

// Returns true if there's space for more sand
function simulateGrain({ blocked, bottom, isBlocked }: Input): boolean {
  let grain = CAVE_TOP;

  while (true) {
    const next: Point2D | undefined = GRAIN_MOVES.map(([x, y]) => ({
      x: grain.x + x,
      y: grain.y + y,
    })).find((pos) => !isBlocked(pos));

    if (!next) {
      blocked.add(toKey(grain)); // This grain has fallen.
      return !R.equals(grain, CAVE_TOP); // There's space for more if it's not at the top.
    }

    if (next.y >= bottom) return false; // sand is falling outside the map, stop simulation
    grain = next;
  }
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
    isBlocked: (pos: Point2D) => pos.y === input.bottom || input.blocked.has(toKey(pos)),
  };

  return simulateSandfall(input) + 1;
}
