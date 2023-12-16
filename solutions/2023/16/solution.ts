import { range } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';
import { Direction } from '~utils/types';

type Input = string[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(''));
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
  return countEnergized(new Map2D(input), new Point(0, 0), Direction.RIGHT);
}

// ---- Part B ----
export function partB(input: Input): number {
  const map = new Map2D(input);

  let max = 0;
  range(0, input.length).forEach((x) => {
    max = Math.max(max, countEnergized(map, new Point(x, 0), Direction.RIGHT));
    max = Math.max(max, countEnergized(map, new Point(x, input[0].length - 1), Direction.LEFT));
  });

  range(0, input[0].length).forEach((y) => {
    max = Math.max(max, countEnergized(map, new Point(0, y), Direction.DOWN));
    max = Math.max(max, countEnergized(map, new Point(input[0].length - 1, y), Direction.UP));
  });

  return max;
}
