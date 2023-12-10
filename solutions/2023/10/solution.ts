import { range, until } from 'ramda';
import { readFile } from '~utils/core';
import { Direction, Map2D, Point } from '~utils/points';

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

const HORIZONTAL_CROSSING = '|LJ';

function getNeighbors(point: Point): Record<Direction, Point> {
  return {
    [Direction.EAST]: point.add({ x: 0, y: 1 }),
    [Direction.SOUTH]: point.add({ x: 1, y: 0 }),
    [Direction.WEST]: point.add({ x: 0, y: -1 }),
    [Direction.NORTH]: point.add({ x: -1, y: 0 }),
  };
}

function BFS(map: Map2D, start: Point): { path: Set<string>; steps: number } {
  const path = new Set<string>();
  let steps = 0;

  function visitAndGetNeighbors(point: Point): Point[] {
    path.add(`${point}`);
    const neighbors = getNeighbors(point);

    return Object.values(Direction)
      .filter((direction) => CAN_GO[direction].includes(map.get(point)))
      .map((direction) => ({ direction, neighbor: neighbors[direction] }))
      .filter(
        ({ direction, neighbor }) =>
          !path.has(`${neighbor}`) &&
          neighbor.isIn(map) &&
          VALID_NEIGHBORS[direction].includes(map.get(neighbor))
      )
      .map(({ neighbor }) => neighbor);
  }

  let pointsToVisit = [start];
  while (pointsToVisit.length) {
    pointsToVisit = pointsToVisit.reduce<Point[]>(
      (nextPoints, point) => nextPoints.concat(visitAndGetNeighbors(point)),
      []
    );

    steps++;
  }

  return { path, steps: steps - 1 };
}

// ---- Part A ----
export function partA(input: Input): number {
  const map = new Map2D(input);
  const start = map.findByValue('S');
  return BFS(map, start).steps;
}

// ---- Part B ----
export function partB(input: Input): number {
  const map = new Map2D(input);
  const start = map.findByValue('S');

  const { path } = BFS(new Map2D(input), start);

  function isInPipe(start: Point): boolean {
    const intersections = range(start.y, map.maxY + 1)
      .map((y) => new Point(start.x, y))
      .filter((point) => path.has(`${point}`) && HORIZONTAL_CROSSING.includes(map.get(point)));

    return intersections.length % 2 === 1;
  }

  return map.reduce((result, point) => {
    if (!path.has(`${point}`)) {
      if (isInPipe(point)) {
        return result + 1;
      }
    }
    return result;
  }, 0);
}
