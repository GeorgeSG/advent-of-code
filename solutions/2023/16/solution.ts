import { range } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';
import { Direction } from '~utils/types';

type Input = Map2D<string>;

// Parser
export function prepareInput(inputFile: string): Input {
  return new Map2D(readFile(inputFile).map((line) => line.split('')));
}

const REFLECTIONS = {
  '/': {
    [Direction.UP]: [Direction.RIGHT],
    [Direction.DOWN]: [Direction.LEFT],
    [Direction.LEFT]: [Direction.DOWN],
    [Direction.RIGHT]: [Direction.UP],
  },
  '\\': {
    [Direction.UP]: [Direction.LEFT],
    [Direction.DOWN]: [Direction.RIGHT],
    [Direction.LEFT]: [Direction.UP],
    [Direction.RIGHT]: [Direction.DOWN],
  },
  '-': {
    [Direction.UP]: [Direction.LEFT, Direction.RIGHT],
    [Direction.DOWN]: [Direction.LEFT, Direction.RIGHT],
    [Direction.LEFT]: [Direction.LEFT],
    [Direction.RIGHT]: [Direction.RIGHT],
  },
  '|': {
    [Direction.UP]: [Direction.UP],
    [Direction.DOWN]: [Direction.DOWN],
    [Direction.LEFT]: [Direction.UP, Direction.DOWN],
    [Direction.RIGHT]: [Direction.UP, Direction.DOWN],
  },
};

function energize(
  map: Map2D,
  location: Point,
  direction: Direction,
  visited: Map<string, Direction[]>
): void {
  const key = location.toKey();
  if (!location.isIn(map)) {
    return;
  }

  if (visited.has(key) && visited.get(key).includes(direction)) {
    return;
  }

  visited.set(key, [...(visited.get(key) || []), direction]);

  const tile = map.get(location);
  const reflections = REFLECTIONS[tile]?.[direction];
  if (reflections) {
    reflections.forEach((reflectedDirection) =>
      energize(map, location.move(reflectedDirection), reflectedDirection, visited)
    );
  } else {
    energize(map, location.move(direction), direction, visited);
  }
}

function countEnergized(map: Map2D, start: Point, direction: Direction): number {
  const visited = new Map<string, Direction[]>();
  energize(map, start, direction, visited);
  return [...visited].length;
}

// ---- Part A ----
export function partA(input: Input): number {
  return countEnergized(input, new Point(0, 0), Direction.RIGHT);
}

// ---- Part B ----
export function partB(input: Input): number {
  let max = 0;

  range(0, input.maxX).forEach((x) => {
    max = Math.max(max, countEnergized(input, new Point(x, 0), Direction.RIGHT));
    max = Math.max(max, countEnergized(input, new Point(x, input.maxY), Direction.LEFT));
  });

  range(0, input.maxY).forEach((y) => {
    max = Math.max(max, countEnergized(input, new Point(0, y), Direction.DOWN));
    max = Math.max(max, countEnergized(input, new Point(input.maxX, y), Direction.UP));
  });

  return max;
}
