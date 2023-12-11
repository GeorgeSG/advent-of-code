import { range } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Direction, Point } from '~utils/points';

type Input = { pipeMap: Map2D; start: Point };

// Parser
export function prepareInput(inputFile: string): Input {
  const pipeMap = new Map2D(readFile(inputFile, (line) => line.split('')));
  const start = pipeMap.findByValue('S');
  return { pipeMap, start };
}

const HAS_FLOW_TO = {
  [Direction.RIGHT]: 'S-LF',
  [Direction.DOWN]: 'S|F7',
  [Direction.LEFT]: 'S-7J',
  [Direction.UP]: 'S|LJ',
};

const HAS_FLOW_FROM = {
  [Direction.RIGHT]: 'J-7',
  [Direction.DOWN]: 'J|L',
  [Direction.LEFT]: 'L-F',
  [Direction.UP]: '7|F',
};

const HORIZONTAL_CROSSING = '|LJ';

function getNeighbors(point: Point): Record<Direction, Point> {
  return {
    [Direction.RIGHT]: point.add({ x: 0, y: 1 }),
    [Direction.DOWN]: point.add({ x: 1, y: 0 }),
    [Direction.LEFT]: point.add({ x: 0, y: -1 }),
    [Direction.UP]: point.add({ x: -1, y: 0 }),
  };
}

function BFS(map: Map2D, start: Point): { path: Set<string>; steps: number } {
  const path = new Set<string>();
  let steps = 0;

  function visitAndGetNeighbors(point: Point): Point[] {
    path.add(point.toKey());
    const neighbors = getNeighbors(point);

    return Object.values(Direction)
      .filter((direction) => HAS_FLOW_TO[direction].includes(map.get(point)))
      .map((direction) => ({ direction, neighbor: neighbors[direction] }))
      .filter(
        ({ direction, neighbor }) =>
          !path.has(`${neighbor}`) &&
          neighbor.isIn(map) &&
          HAS_FLOW_FROM[direction].includes(map.get(neighbor))
      )
      .map(({ neighbor }) => neighbor);
  }

  let pointsToVisit = [start];
  while (pointsToVisit.length) {
    pointsToVisit = pointsToVisit.reduce(
      (nextPoints, point) => nextPoints.concat(visitAndGetNeighbors(point)),
      []
    );

    steps++;
  }

  return { path, steps: steps - 1 };
}

// ---- Part A ----
export function partA({ pipeMap, start }: Input): number {
  return BFS(pipeMap, start).steps;
}

// ---- Part B ----
export function partB({ pipeMap, start }: Input): number {
  const { path } = BFS(pipeMap, start);

  function isInPipe(point: Point): boolean {
    const intersections = range(point.y, pipeMap.maxY + 1)
      .map((y) => new Point(point.x, y))
      .filter(
        (point) => path.has(point.toKey()) && HORIZONTAL_CROSSING.includes(pipeMap.get(point))
      );

    return intersections.length % 2 === 1;
  }

  return pipeMap.reduce(
    (result, point) => (!path.has(point.toKey()) && isInPipe(point) ? result + 1 : result),
    0
  );
}
