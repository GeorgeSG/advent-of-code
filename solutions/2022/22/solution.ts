import R from 'ramda';
import { findMax, ijMeBro } from '~utils/arrays';
import { readFile, readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point2D } from '~utils/points';

type Direction = {
  steps: number;
  turn?: 'L' | 'R';
};

type Input = {
  directions: Direction[];
  map: string[];
};

type WrappingFn = (point: Point2D, map: string[]) => Point2D;
type StepFn = (point: Point2D, facing: number, map: string[]) => Point2D;

const FACING_STEP_DELTA = {
  0: { x: 0, y: 1 },
  1: { x: 1, y: 0 },
  2: { x: 0, y: -1 },
  3: { x: -1, y: 0 },
};

// Parser
export function prepareInput(inputFile: string): Input {
  const input = readFileRaw(inputFile).split('\n');
  input.pop();

  const directionsStr = input.pop();
  input.pop();

  let directions: Direction[] = [];
  let currentDirection = '';
  directionsStr.split('').forEach((char) => {
    if (char === 'L' || char === 'R') {
      directions.push({ steps: toI(currentDirection), turn: char });
      currentDirection = '';
    } else {
      currentDirection += `${char}`;
    }
  });

  directions.push({ steps: toI(currentDirection) });

  const longestLine = findMax(input.map((line) => line.length));
  return { directions, map: input.map((line) => line.padEnd(longestLine, ' ')) };
}

const sumPoints = R.mergeWith(R.add);

function makeTurn(currentFacing: number, turn: 'L' | 'R'): number {
  const direction = turn === 'L' ? -1 : 1;
  let newFacing = (currentFacing + direction) % 4;
  return newFacing === -1 ? 3 : newFacing;
}

function move(
  start: Point2D,
  facing: number,
  steps: number,
  stepFn: StepFn,
  map: string[]
): Point2D {
  let newPos = start;
  while (steps > 0) {
    steps -= 1;

    let step = stepFn(newPos, facing, map);
    if (map[step.x][step.y] === '#') {
      return newPos;
    } else {
      newPos = step;
    }
  }

  return newPos;
}

function findStart(map: string[]): Point2D {
  for (let i = 0; i < map[0].length; i++) {
    if (map[0][i] === '.') {
      return { x: 0, y: i };
    }
  }
}

function findLastPosition(input: Input, stepFn: StepFn): number {
  const { map, directions } = input;

  let facing = 0;
  let position: Point2D = findStart(map);

  directions.forEach(({ steps, turn }) => {
    position = move(position, facing, steps, stepFn, map);
    facing = turn ? makeTurn(facing, turn) : facing;
  });

  position = sumPoints(position, { x: 1, y: 1 });
  return position.x * 1000 + position.y * 4 + facing;
}

// ---- Part A ----
export function partA(input: Input): number {
  const wrapEmptySpace: WrappingFn = ({ x, y }: Point2D, map: string[]): Point2D => {
    if (x === -1) return { x: map.length - 1, y };
    if (x === map.length) return { x: 0, y };
    if (y === -1) return { x, y: map[x].length - 1 };
    if (y === map[x].length) return { x, y: 0 };

    return { x, y };
  };

  const wrappingStep: StepFn = (start: Point2D, facing: number, map: string[]): Point2D => {
    const stepDelta = FACING_STEP_DELTA[facing];
    let attemptStep = start;
    do {
      attemptStep = wrapEmptySpace(sumPoints(attemptStep, stepDelta), map);
    } while (map[attemptStep.x][attemptStep.y] === ' ');

    return attemptStep;
  };

  return findLastPosition(input, wrappingStep);
}

// ---- Part B ----
export const SWITCH_SIDES = {
  1: [2, 3, 4, 6],
  2: [5, 3, 1, 6],
  3: [2, 5, 4, 1],
  4: [5, 6, 1, 3],
  5: [2, 6, 4, 3],
  6: [5, 2, 1, 4],
};

export const SWITCH_COORDS = {
  1: [
    ({ x, y }, n) => ({ x, y: 0 }),
    ({ x, y }, n) => ({ x: 0, y }),
    ({ x, y }, n) => ({ x: n - x, y: 0 }),
    ({ x, y }, n) => ({ x: y, y: 0 }),
  ],
  2: [
    ({ x, y }, n) => ({ x: n - x, y: n }),
    ({ x, y }, n) => ({ x: y, y: n }),
    ({ x, y }, n) => ({ x, y: n }),
    ({ x, y }, n) => ({ x: n, y }),
  ],
  3: [
    ({ x, y }, n) => ({ x: n, y: x }),
    ({ x, y }, n) => ({ x: 0, y }),
    ({ x, y }, n) => ({ x: 0, y: x }),
    ({ x, y }, n) => ({ x: n, y }),
  ],
  4: [
    ({ x, y }, n) => ({ x, y: 0 }),
    ({ x, y }, n) => ({ x: 0, y }),
    ({ x, y }, n) => ({ x: n - x, y: 0 }),
    ({ x, y }, n) => ({ x: y, y: 0 }),
  ],
  5: [
    ({ x, y }, n) => ({ x: n - x, y: n }),
    ({ x, y }, n) => ({ x: y, y: n }),
    ({ x, y }, n) => ({ x, y: n }),
    ({ x, y }, n) => ({ x: n, y }),
  ],
  6: [
    ({ x, y }, n) => ({ x: n, y: x }),
    ({ x, y }, n) => ({ x: 0, y }),
    ({ x, y }, n) => ({ x: 0, y: x }),
    ({ x, y }, n) => ({ x: n, y }),
  ],
};

export const SWITCH_FACING = {
  1: [0, 1, 0, 0],
  2: [2, 2, 2, 3],
  3: [3, 1, 1, 3],
  4: [0, 1, 0, 0],
  5: [2, 2, 2, 3],
  6: [3, 1, 1, 3],
};

export function partB(input: Input): number {
  const { map, directions } = input;

  const sides: string[][] = [
    ['i am a dummy, because sides are labelled 1-6'],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  const cubeSide = 50;
  for (let i = 0; i < cubeSide; i++) {
    sides[1].push(map[i].slice(cubeSide, 2 * cubeSide));
    sides[2].push(map[i].slice(2 * cubeSide, 3 * cubeSide));
  }

  for (let i = cubeSide; i < cubeSide * 2; i++) {
    sides[3].push(map[i].slice(cubeSide, 2 * cubeSide));
  }

  for (let i = cubeSide * 2; i < cubeSide * 3; i++) {
    sides[4].push(map[i].slice(0, cubeSide));
    sides[5].push(map[i].slice(cubeSide, 2 * cubeSide));
  }

  for (let i = cubeSide * 3; i < cubeSide * 4; i++) {
    sides[6].push(map[i].slice(0, cubeSide));
  }

  type Position = { side: number; coords: Point2D };
  const cubeMax = cubeSide - 1;

  let current: Position = { side: 1, coords: { x: 0, y: 0 } };
  let facing = 0;

  directions.forEach(({ steps, turn }) => {
    let tempSide = current.side;
    let tempCoords = current.coords;
    let tempFacing = facing;

    while (steps > 0) {
      steps -= 1;
      let attemptStep = sumPoints(current.coords, FACING_STEP_DELTA[facing]);
      const { x: newX, y: newY } = attemptStep;

      if (newX < 0 || newY < 0 || newX > cubeMax || newY > cubeMax) {
        tempSide = SWITCH_SIDES[current.side][facing];
        tempCoords = SWITCH_COORDS[current.side][facing](current.coords, cubeMax);
        tempFacing = SWITCH_FACING[current.side][facing];
      } else {
        tempCoords = attemptStep;
      }

      if (sides[tempSide][tempCoords.x].charAt(tempCoords.y) === '#') {
        break;
      } else {
        current = { side: tempSide, coords: tempCoords };
        facing = tempFacing;
      }
    }
    facing = turn ? makeTurn(facing, turn) : facing;
  });

  const FINAL_COORDS = {
    1: ({ x, y }) => ({ x, y: cubeSide + y }),
    2: ({ x, y }) => ({ x, y: 2 * cubeSide + y }),
    3: ({ x, y }) => ({ x: cubeSide + x, y: cubeSide + y }),
    4: ({ x, y }) => ({ x: 2 * cubeSide + x, y }),
    5: ({ x, y }) => ({ x: 2 * cubeSide + x, y: cubeSide + y }),
    6: ({ x, y }) => ({ x: 3 * cubeMax + x, y }),
  };

  const { side, coords } = current;

  const finalCoords = sumPoints(FINAL_COORDS[side](coords), { x: 1, y: 1 });

  console.log(finalCoords);

  // not 65318, 65, 79
  return finalCoords.x * 1000 + finalCoords.y * 4 + facing;
}
