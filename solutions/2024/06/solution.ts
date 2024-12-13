import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';
import { Direction } from '~utils/types';

type Input = {
  map: Map2D;
  guard: Point;
};

const OBSTACLE = '#';
const EMPTY = '.';

// Parser
export function prepareInput(inputFile: string): Input {
  const map = new Map2D(readFile(inputFile, (l) => l.split('')));

  return { map, guard: map.findByValue('^') };
}

const nextDirection = {
  [Direction.UP]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.DOWN,
  [Direction.DOWN]: Direction.LEFT,
  [Direction.LEFT]: Direction.UP,
};

function getGuardPath(map: Map2D, guard: Point): { isLoop: boolean; path: Set<string> } {
  let direction = Direction.UP;
  const path = new Set<string>();
  const obstaclesHitted = new Set<string>();

  while (guard.isIn(map)) {
    path.add(guard.toKey());

    let next = guard.move(direction);

    // if there is an obstacle ahead, turn right
    while (next.isIn(map) && map.get(next) === OBSTACLE) {
      const obstacleKey = `${direction}${guard.toKey()}`;

      // if we hit the same obstacle twice from the same direction, we are in a loop
      if (obstaclesHitted.has(obstacleKey)) {
        return { isLoop: true, path: path };
      }
      obstaclesHitted.add(obstacleKey);

      // rotate, move, try again
      direction = nextDirection[direction];
      next = guard.move(direction);
    }

    guard = next;
  }

  return { isLoop: false, path: path };
}

// ---- Part A ----
export function partA({ map, guard }: Input): number {
  return getGuardPath(map, guard).path.size;
}

// ---- Part B ----
export function partB({ map, guard }: Input): number {
  const path = getGuardPath(map, guard).path;

  return [...path]
    .map(Point.fromKey)
    .filter((point) => map.get(point) === EMPTY)
    .reduce((loops, point) => {
      map.set(point, OBSTACLE);
      const newPath = getGuardPath(map, guard);
      map.set(point, EMPTY);

      return loops + (newPath.isLoop ? 1 : 0);
    }, 0);
}
