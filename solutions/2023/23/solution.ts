import { skip } from 'node:test';
import { path } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';
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

function dfs1(input: Input, current: Point, end: Point, visited: Set<string>): number {
  if (current.equals(end)) {
    return visited.size - 1;
  }

  visited.add(current.toKey());

  let neighbours = [];
  switch (input.get(current)) {
    case '>':
    case '<':
    case '^':
    case 'v':
      current = current.move(MOVES[input.get(current)]);
      neighbours = [current];
      break;
    case '.':
      neighbours = input.findAdjacent(current);
      break;
  }

  neighbours = neighbours.filter((p) => !visited.has(p.toKey()) && input.get(p) !== '#');

  let longestPath = 0;
  for (let neighbour of neighbours) {
    visited.add(neighbour.toKey());
    longestPath = Math.max(longestPath, dfs1(input, neighbour, end, visited));
    visited.delete(neighbour.toKey());
  }

  return longestPath;
}

let max = 0;
function dfs2(input: Input, current: Point, end: Point, visited: Set<string>): number {
  if (current.equals(end)) {
    return visited.size - 1;
  }

  visited.add(current.toKey());

  let neighbours = [];

  if (current.y < input.maxY)
    neighbours.push({ x: current.x, y: current.y + 1, dir: Direction.RIGHT });
  if (current.y > 0) neighbours.push({ x: current.x, y: current.y - 1, dir: Direction.LEFT });
  if (current.x < input.maxX)
    neighbours.push({ x: current.x + 1, y: current.y, dir: Direction.DOWN });
  if (current.x > 0) neighbours.push({ x: current.x - 1, y: current.y, dir: Direction.UP });

  neighbours = neighbours.filter(
    (p) => !visited.has(new Point(p.x, p.y).toKey()) && input.get(p) !== '#'
  );

  let longestPath = 0;
  for (let { x, y, dir } of neighbours) {
    let neighbour = new Point(x, y);
    if (neighbour.equals(end)) {
      return visited.size;
    }

    const skipped = [neighbour];
    while (
      !visited.has(neighbour.move(dir).toKey()) &&
      (((dir === Direction.UP || dir === Direction.DOWN) &&
        input.get(neighbour.move(Direction.LEFT)) === '#' &&
        input.get(neighbour.move(Direction.RIGHT)) === '#') ||
        ((dir === Direction.LEFT || dir === Direction.RIGHT) &&
          input.get(neighbour.move(Direction.UP)) === '#' &&
          input.get(neighbour.move(Direction.DOWN)) === '#'))
    ) {
      neighbour = neighbour.move(dir);
      skipped.push(neighbour);
      if (neighbour.equals(end)) {
        return visited.size + skipped.length - 1;
      }
    }

    skipped.forEach((p) => visited.add(p.toKey()));

    const newPathLength = dfs2(input, neighbour, end, visited);
    if (longestPath < newPathLength) {
      if (max < newPathLength) {
        console.log('new longest path', newPathLength);
        max = newPathLength;
      }
      longestPath = newPathLength;
    }

    skipped.forEach((p) => visited.delete(p.toKey()));
  }
  return longestPath;
}

// ---- Part A ----
export function partA(input: Input): number {
  const start = new Point(0, 1);
  const end = new Point(input.maxY, input.maxX - 1);

  return dfs1(input, start, end, new Set<string>());
}

// ---- Part B ----
export function partB(input: Input): number {
  const start = new Point(0, 1);
  const end = new Point(input.maxY, input.maxX - 1);

  return dfs2(input, start, end, new Set<string>());
  // answer: 6546
}
