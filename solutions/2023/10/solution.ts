import { ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { Direction, Map2D, Point, Point2D, toKey } from '~utils/points';

type Input = string[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(''));
}

const CAN_GO = {
  [Direction.EAST]: 'S-LF',
  [Direction.SOUTH]: 'S|F7',
  [Direction.WEST]: 'S-7J',
  [Direction.NORTH]: 'S|LJ',
};

const VALID_NEIGHBORS = {
  [Direction.EAST]: 'J-7',
  [Direction.SOUTH]: 'J|L',
  [Direction.WEST]: 'L-F',
  [Direction.NORTH]: '7|F',
};

function getNeighbors(point: Point): Record<Direction, Point> {
  return {
    [Direction.EAST]: point.add(Point.fromCoords({ x: 0, y: 1 })),
    [Direction.SOUTH]: point.add(Point.fromCoords({ x: 1, y: 0 })),
    [Direction.WEST]: point.add(Point.fromCoords({ x: 0, y: -1 })),
    [Direction.NORTH]: point.add(Point.fromCoords({ x: -1, y: 0 })),
  };
}

function findLongestPath(map: Map2D, start: Point): number {
  let steps = 0;

  const visited = new Set<string>();
  visited.add(start.toKey());

  let next = [start];
  while (next.length) {
    next = next.reduce<Point[]>((newNext, point) => {
      visited.add(point.toKey());

      const neighbors = getNeighbors(point);

      Object.values(Direction).forEach((direction: Direction) => {
        const neighbor = neighbors[direction];
        if (
          map.isValid(neighbor) &&
          CAN_GO[direction].includes(map.get(point)) &&
          VALID_NEIGHBORS[direction].includes(map.get(neighbor)) &&
          !visited.has(neighbor.toKey())
        ) {
          newNext.push(neighbor);
        }
      });

      return newNext;
    }, []);

    steps++;
  }

  return steps - 1;
}

// ---- Part A ----
export function partA(input: Input): number {
  let start: Point;
  ijMeBro(input, (x, y, el) => {
    if (el === 'S') {
      start = Point.fromCoords({ x, y });
    }
  });

  return findLongestPath(new Map2D(input), start);
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
