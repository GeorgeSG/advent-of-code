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

function energize(
  map: Map2D,
  current: Point,
  direction: Direction,
  visited: Map<string, Direction[]>
): void {
  const key = current.toKey();
  if (!current.isIn(map)) {
    return;
  }

  if (visited.has(key) && visited.get(key).includes(direction)) {
    return;
  }

  visited.set(key, [...(visited.get(key) || []), direction]);

  switch (map.get(current)) {
    case '.': {
      energize(map, current.move(direction), direction, visited);
      break;
    }
    case '-': {
      switch (direction) {
        case Direction.UP:
        case Direction.DOWN:
          energize(map, current.move(Direction.LEFT), Direction.LEFT, visited);
          energize(map, current.move(Direction.RIGHT), Direction.RIGHT, visited);
          break;
        case Direction.LEFT:
        case Direction.RIGHT:
          energize(map, current.move(direction), direction, visited);
          break;
      }
      break;
    }
    case '|': {
      switch (direction) {
        case Direction.UP:
        case Direction.DOWN:
          energize(map, current.move(direction), direction, visited);
          break;
        case Direction.LEFT:
        case Direction.RIGHT:
          energize(map, current.move(Direction.UP), Direction.UP, visited);
          energize(map, current.move(Direction.DOWN), Direction.DOWN, visited);
          break;
      }
      break;
    }
    case '/': {
      switch (direction) {
        case Direction.UP:
          direction = Direction.RIGHT;
          break;
        case Direction.DOWN:
          direction = Direction.LEFT;
          break;
        case Direction.LEFT:
          direction = Direction.DOWN;
          break;
        case Direction.RIGHT:
          direction = Direction.UP;
          break;
      }
      energize(map, current.move(direction), direction, visited);
      break;
    }
    case '\\': {
      switch (direction) {
        case Direction.UP:
          direction = Direction.LEFT;
          break;
        case Direction.DOWN:
          direction = Direction.RIGHT;
          break;
        case Direction.LEFT:
          direction = Direction.UP;
          break;
        case Direction.RIGHT:
          direction = Direction.DOWN;
          break;
      }
      energize(map, current.move(direction), direction, visited);
      break;
    }
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
    max = Math.max(max, countEnergized(input, new Point(x, input.maxY - 1), Direction.LEFT));
  });

  range(0, input.maxY).forEach((y) => {
    max = Math.max(max, countEnergized(input, new Point(0, y), Direction.DOWN));
    max = Math.max(max, countEnergized(input, new Point(input.maxX - 1, y), Direction.UP));
  });

  return max;
}
