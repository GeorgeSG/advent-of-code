import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point, Point2D } from '~utils/points';
import { Direction } from '~utils/types';

type Input = Map2D<string>;

// Parser
export function prepareInput(inputFile: string): Input {
  return new Map2D(readFile(inputFile, (line) => line.split('')));
}

const MOVES = {
  '>': Direction.RIGHT,
  '<': Direction.LEFT,
  '^': Direction.UP,
  v: Direction.DOWN,
};

type NeighborWithDirection = { point: Point; dir: Direction };

let max = 0;
let lastMaxUpdate = 0;
function dfs(
  input: Input,
  current: Point,
  end: Point,
  visited: Set<string>,
  getNeighbours: (point: Point, visited: Set<string>) => NeighborWithDirection[],
  enforceSlopes = false
): number {
  // HACK: time limit search.
  if (new Date().getTime() - lastMaxUpdate > 1_000_000) {
    return max;
  }

  if (current.equals(end)) {
    return visited.size - 1;
  }

  visited.add(current.toKey());

  const neighbours = getNeighbours(current, visited);

  let longestPath = 0;
  for (let { point, dir } of neighbours) {
    let neighbour = new Point(point.x, point.y);
    if (neighbour.equals(end)) {
      return visited.size;
    }

    const skipped = [neighbour];
    while (
      !visited.has(neighbour.move(dir).toKey()) &&
      (!enforceSlopes || input.get(neighbour) === '.') &&
      (((dir === Direction.UP || dir === Direction.DOWN) &&
        input.get(neighbour.move(Direction.LEFT)) === '#' &&
        input.get(neighbour.move(Direction.RIGHT)) === '#') ||
        ((dir === Direction.LEFT || dir === Direction.RIGHT) &&
          input.get(neighbour.move(Direction.UP)) === '#' &&
          input.get(neighbour.move(Direction.DOWN)) === '#'))
    ) {
      neighbour = neighbour.move(dir);
      if (neighbour.equals(end)) {
        return visited.size + skipped.length;
      }

      skipped.push(neighbour);
    }

    skipped.forEach((p) => visited.add(p.toKey()));
    const newPathLength = dfs(input, neighbour, end, visited, getNeighbours, enforceSlopes);
    skipped.forEach((p) => visited.delete(p.toKey()));

    longestPath = Math.max(longestPath, newPathLength);

    if (max < newPathLength && !enforceSlopes) {
      max = newPathLength;
      lastMaxUpdate = new Date().getTime();
    }
  }

  return longestPath;
}

function getAllNeighbours(
  input: Input,
  current: Point,
  visited: Set<string>
): NeighborWithDirection[] {
  return Object.values(MOVES)
    .map((dir) => ({ point: current.move(dir), dir }))
    .filter(
      ({ point }) => point.isIn(input) && !visited.has(point.toKey()) && input.get(point) !== '#'
    );
}

function startDfs(
  input: Input,
  getNeighbours: (current: Point, visited: Set<string>) => NeighborWithDirection[],
  enforceSlopes = false
): number {
  max = 0;
  lastMaxUpdate = new Date().getTime();

  const start = new Point(0, 1);
  const end = new Point(input.maxY, input.maxX - 1);

  return dfs(input, start, end, new Set<string>(), getNeighbours, enforceSlopes);
}

// ---- Part A ----
export function partA(input: Input): number {
  return startDfs(
    input,
    (current: Point, visited: Set<string>) => {
      const currentVal = input.get(current);

      switch (currentVal) {
        case '>':
        case '<':
        case '^':
        case 'v':
          const dir = MOVES[currentVal];
          return [{ point: current.move(dir), dir }].filter(
            ({ point }) => !visited.has(point.toKey()) && input.get(point) !== '#'
          );
        case '.':
          return getAllNeighbours(input, current, visited);
      }
    },
    true
  );
}

// ---- Part B ----
export function partB(input: Input): number {
  return startDfs(input, (current: Point, visited: Set<string>) =>
    getAllNeighbours(input, current, visited)
  );
  // answer: 6546
}
