import R from 'ramda';
import { findMinMax } from '~utils/arrays';
import { readFile } from '~utils/core';
import { fromKey, Point2D, sumPoints, toKey } from '~utils/points';

type Input = Set<string>;
type Direction = 'N' | 'S' | 'W' | 'E';

// Parser
export function prepareInput(inputFile: string): Input {
  const input = new Set<string>();
  readFile(inputFile, (line, x) =>
    line.split('').forEach((char, y) => {
      if (char === '#') {
        input.add(toKey({ x, y }));
      }
    })
  );
  return input;
}

// prettier-ignore
const NEIGHBOURS_DIR = {
  N: [ { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 } ],
  S: [ { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 } ],
  W: [ { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 } ],
  E: [ { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 } ],
};

const NEIGHBOURS = R.uniq(R.flatten(Object.values(NEIGHBOURS_DIR)));

function findNeighbourIn(offsets: Point2D[], point: Point2D, input: Input) {
  return offsets.find((offset) => {
    const neighbour = sumPoints(point, offset);
    return input.has(toKey(neighbour));
  });
}

function hasNeightbourIn(posKey: string, direction: Direction, input: Input): boolean {
  return findNeighbourIn(NEIGHBOURS_DIR[direction], fromKey(posKey), input) !== undefined;
}

function hasNeighbour(posKey: string, input: Input): boolean {
  return findNeighbourIn(NEIGHBOURS, fromKey(posKey), input) !== undefined;
}

function simulateRound(elves: Input, directions: Direction[]): boolean {
  const moving = Array.from(elves.keys()).filter((elf) => hasNeighbour(elf, elves));
  if (moving.length === 0) {
    return false;
  }

  const moveAnnounce: string[][] = [];
  moving.forEach((elf) => {
    const dir = directions.find((dir) => !hasNeightbourIn(elf, dir, elves));
    if (dir) {
      const newPosition = sumPoints(fromKey(elf), NEIGHBOURS_DIR[dir][1]);
      moveAnnounce.push([toKey(newPosition), elf]);
    }
  });

  const uniqueMoves = moveAnnounce.filter(
    (move) => R.count((a: string[]) => a[0] === move[0], moveAnnounce) < 2
  );

  uniqueMoves.forEach((move) => {
    elves.delete(move[1]);
    elves.add(move[0]);
  });

  directions.push(directions.shift());

  return true;
}

// ---- Part A ----
export function partA(elves: Input): number {
  const directions: Direction[] = ['N', 'S', 'W', 'E'];

  let moves = 10;
  while (moves > 0) {
    simulateRound(elves, directions);
    moves -= 1;
  }

  const [xs, ys] = R.transpose(
    Array.from(elves.keys()).map((key) => [fromKey(key).x, fromKey(key).y])
  );

  const [minX, maxX] = findMinMax(xs);
  const [minY, maxY] = findMinMax(ys);

  return (maxX - minX + 1) * (maxY - minY + 1) - elves.size;
}

// ---- Part B ----
export function partB(elfs: Input): number {
  const directions: Direction[] = ['N', 'S', 'W', 'E'];

  let moves = 1;
  while (simulateRound(elfs, directions)) moves += 1;

  return moves;
}
