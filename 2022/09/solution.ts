import R from 'ramda';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import {
  Point2D,
  pointToKey as toString,
  sumPoints as add,
  ZERO as POINT_ZERO,
} from '~utils/points';

type Motion = {
  direction: Point2D;
  steps: number;
};

type Input = Motion[];

const DIRECTION_TO_COORDS = {
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
};

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line): Motion => {
    const [dir, steps] = line.split(' ');
    return { direction: DIRECTION_TO_COORDS[dir], steps: toI(steps) };
  });
}

function moveAtowardsB(a: number, b: number): number {
  if (a === b) return a;
  return a > b ? a - 1 : a + 1;
}

function follow(tail: Point2D, head: Point2D): Point2D {
  if (Math.abs(head.x - tail.x) <= 1 && Math.abs(head.y - tail.y) <= 1) {
    // No movement needed
    return tail;
  }

  return { x: moveAtowardsB(tail.x, head.x), y: moveAtowardsB(tail.y, head.y) };
}

function solveForKnots(knotCount: number, input: Input): number {
  const visited = new Set();
  const knots: Point2D[] = R.range(0, knotCount).map((_) => POINT_ZERO);

  input.forEach(({ direction, steps }) => {
    while (steps > 0) {
      steps -= 1;

      knots[0] = add(knots[0], direction);
      for (let i = 1; i < knots.length; i++) {
        knots[i] = follow(knots[i], knots[i - 1]);
      }

      visited.add(toString(knots[knots.length - 1]));
    }
  });

  return visited.size;
}

// ---- Part A ----
export function partA(input: Input): number {
  return solveForKnots(2, input);
}

// ---- Part B ----
export function partB(input: Input): number {
  return solveForKnots(10, input);
}
