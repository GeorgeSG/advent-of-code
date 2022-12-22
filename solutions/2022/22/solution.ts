import R from 'ramda';
import { findMax } from '~utils/arrays';
import { readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point2D } from '~utils/points';
import { example_22, real_22 } from './config';

type Direction = {
  steps: number;
  turn?: 'L' | 'R';
};

type Input = {
  directions: Direction[];
  map: string[];
  config: any;
};

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

  // here be hardcoded magic
  let config = inputFile.includes('example') ? example_22 : real_22;

  return { directions, map: input.map((line) => line.padEnd(longestLine, ' ')), config };
}

const sumPoints = R.mergeWith(R.add);

function makeTurn(currentFacing: number, turn: 'L' | 'R'): number {
  const direction = turn === 'L' ? -1 : 1;
  let newFacing = (currentFacing + direction) % 4;
  return newFacing === -1 ? 3 : newFacing;
}

function resultFromFinalPos(position: Point2D, facing: number): number {
  position = sumPoints(position, { x: 1, y: 1 });
  return position.x * 1000 + position.y * 4 + facing;
}

// ---- Part A ----
export function partA(input: Input): number {
  type WrappingFn = (point: Point2D) => Point2D;
  type StepFn = (point: Point2D, facing: number) => Point2D;
  const { map, directions } = input;

  // helper FNs
  const move = (start: Point2D, facing: number, steps: number, stepFn: StepFn): Point2D => {
    let newPos = start;
    while (steps > 0) {
      steps -= 1;

      let step = stepFn(newPos, facing);
      if (map[step.x][step.y] === '#') {
        return newPos;
      } else {
        newPos = step;
      }
    }

    return newPos;
  };

  const findStart = (): Point2D => {
    for (let i = 0; i < map[0].length; i++) {
      if (map[0][i] === '.') {
        return { x: 0, y: i };
      }
    }
  };

  const wrapEmptySpace: WrappingFn = ({ x, y }: Point2D): Point2D => {
    if (x === -1) return { x: map.length - 1, y };
    if (x === map.length) return { x: 0, y };
    if (y === -1) return { x, y: map[x].length - 1 };
    if (y === map[x].length) return { x, y: 0 };

    return { x, y };
  };

  const wrappingStep: StepFn = (start: Point2D, facing: number): Point2D => {
    const stepDelta = FACING_STEP_DELTA[facing];
    let attemptStep = start;
    do {
      attemptStep = wrapEmptySpace(sumPoints(attemptStep, stepDelta));
    } while (map[attemptStep.x][attemptStep.y] === ' ');

    return attemptStep;
  };

  // solve
  let facing = 0;
  let position: Point2D = findStart();

  directions.forEach(({ steps, turn }) => {
    position = move(position, facing, steps, wrappingStep);
    facing = turn ? makeTurn(facing, turn) : facing;
  });

  return resultFromFinalPos(position, facing);
}

// ---- Part B ----

export function partB(input: Input): number {
  const { map, directions, config } = input;

  const sides = config.computeSides(map);

  const cubeMax = config.cubeSide - 1;

  let current = { side: 1, coords: { x: 0, y: 0 } };
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
        tempSide = config.SWITCH_SIDES[current.side][facing];
        tempCoords = config.SWITCH_COORDS[current.side][facing](current.coords, cubeMax);
        tempFacing = config.SWITCH_FACING[current.side][facing];
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

  const { side, coords } = current;

  const finalCoords = sumPoints(config.finalCoords(config.cubeSide)[side](coords), { x: 1, y: 1 });

  return finalCoords.x * 1000 + finalCoords.y * 4 + facing;
}
