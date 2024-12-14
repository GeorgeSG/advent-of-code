import { RunType } from 'cli/lib/solutionRunner';
import { product } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { wrapNumber } from '~utils/numbers';
import { Point } from '~utils/points';

const ROBOT = '#';
const EMPTY = ' ';

type Robot = { position: Point; velocity: Point };
type Input = Robot[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).map((line) => {
    const [y, x, dy, dx] = line
      .split(' ')
      .flatMap((section) => section.split('=')[1].split(','))
      .map(Number);

    return { position: new Point(x, y), velocity: new Point(dx, dy) };
  });
}

function getLimits(runType: RunType): [number, number] {
  return runType === 'real' ? [103, 101] : [7, 11];
}

function moveRobot({ position, velocity }: Robot, maxX: number, maxY: number, steps = 100): Point {
  const { x, y } = position.add({ x: velocity.x * steps, y: velocity.y * steps });
  return new Point(wrapNumber(x, maxX), wrapNumber(y, maxY));
}

// ---- Part A ----
function getQuadrants(maxX: number, maxY: number): [number, number][][] {
  const [halfX, halfY] = [maxX / 2, maxY / 2];

  return [
    [
      [0, Math.floor(halfX) - 1],
      [0, Math.floor(halfY) - 1],
    ],
    [
      [Math.ceil(halfX), maxX - 1],
      [0, Math.floor(halfY) - 1],
    ],
    [
      [0, Math.floor(halfX) - 1],
      [Math.ceil(halfY), maxY - 1],
    ],
    [
      [Math.ceil(halfX), maxX - 1],
      [Math.ceil(halfY), maxY - 1],
    ],
  ];
}

export function partA(input: Input, { runType }): number {
  const [maxX, maxY] = getLimits(runType);
  const robots = input.map((robot) => moveRobot(robot, maxX, maxY));

  const robotsPerQuadrant = getQuadrants(maxX, maxY).map(
    ([[minX, maxX], [minY, maxY]]) =>
      robots.filter(({ x, y }) => x >= minX && x <= maxX && y >= minY && y <= maxY).length
  );

  return product(robotsPerQuadrant);
}

// ---- Part B ----
function getMap(emptyCanvas: string[][], robots: Robot[]): Map2D<string> {
  const map = new Map2D<string>(emptyCanvas);
  robots.forEach((robot) => map.set(robot.position, '#'));
  return map;
}

function hasTree(map: Map2D<string>): boolean {
  const rows = map.input.map((row) => row.join(''));
  return rows.some((row) => row.includes(ROBOT.repeat(10)));
}

export function partB(input: Input, { runType }): number {
  if (runType !== RunType.REAL) {
    // Example input doesn't get a tree :(
    return 0;
  }

  const [maxX, maxY] = getLimits(runType);
  const emptyCanvas = Array.from({ length: maxX }, () => Array(maxY).fill(EMPTY));

  let robots = input;
  let seconds = 0;

  while (true) {
    const map = getMap(
      emptyCanvas.map((row) => [...row]),
      robots
    );

    if (hasTree(map)) {
      map.debug();
      return seconds;
    }

    robots = robots.map((robot) => ({ ...robot, position: moveRobot(robot, maxX, maxY, 1) }));

    seconds++;
  }
}
