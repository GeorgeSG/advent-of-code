import { readFile } from '~utils/core';
import { Point } from '~utils/points';
import { Direction } from '~utils/types';

type Input = {
  direction: Direction;
  steps: number;
  color?: string;
}[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => {
    const [direction, steps, color] = line.split(' ');
    return { direction: direction as Direction, steps: Number(steps), color: color.slice(1, 8) };
  });
}

// https://brilliant.org/wiki/area-of-a-polygon/
function getAreaViaMath(input: Input): number {
  const perimeter = input.reduce((acc, { steps }) => acc + steps, 0);

  let current = new Point(0, 0);
  const holes = input.reduce(
    (holes, { direction, steps }) => {
      current = current.move(direction, steps);
      holes.push(current);
      return holes;
    },
    [current]
  );

  const shoelaces = holes.reduce(
    (acc, { x, y }, i) =>
      acc + x * holes[(i + 1) % holes.length].y - y * holes[(i + 1) % holes.length].x,
    0
  );

  return (Math.abs(shoelaces) + perimeter) / 2 + 1;
}

// ---- Part A ----
export function partA(input: Input): number {
  return getAreaViaMath(input);
}

// ---- Part B ----
export function partB(input: Input): number {
  const NUMBER_TO_DIR = [Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP];

  const newDistances = input.map(({ color }) => {
    const steps = parseInt(color.slice(1, 6), 16);
    const direction = NUMBER_TO_DIR[Number(color.slice(-1))];

    return { direction, steps };
  });

  return getAreaViaMath(newDistances);
}
