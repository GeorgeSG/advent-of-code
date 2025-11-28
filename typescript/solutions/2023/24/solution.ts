import { RunType } from 'cli/lib/solutionRunner';
import { permutations } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point, Point2D } from '~utils/points';

type Coord = { x: number; y: number; z: number };
type Input = { coords: Coord; speed: Coord }[];

// Parser
export function prepareInput(inputFile: string): Input {
  const toCoords = (line: string): Coord => {
    const numbers = line.split(', ').map(toI);
    return { x: numbers[0], y: numbers[1], z: numbers[2] };
  };

  return readFile(inputFile, (line) => {
    const [coords, speed] = line.split(' @ ').map(toCoords);
    return { coords, speed };
  });
}

function willCollideInBounds(
  a: Point2D,
  deltaA: Point2D,
  b: Point2D,
  deltaB: Point2D,
  lowerLimit: number,
  upperLimit: number
): boolean {
  const d = deltaA.x * deltaB.y - deltaA.y * deltaB.x;
  if (d === 0) {
    return false;
  }

  const t = ((b.x - a.x) * deltaB.y - (b.y - a.y) * deltaB.x) / d;
  const u = ((b.x - a.x) * deltaA.y - (b.y - a.y) * deltaA.x) / d;

  const n1 = a.x + t * deltaA.x;
  const n2 = a.y + t * deltaA.y;

  return (
    t >= 0 && u >= 0 && lowerLimit <= n1 && n1 <= upperLimit && lowerLimit <= n2 && n2 <= upperLimit
  );
}

// ---- Part A ----
export function partA(input: Input, { runType }: { runType: RunType }): number {
  const lowerLimit = runType === RunType.REAL ? 200_000_000_000_000 : 7;
  const upperLimit = runType === RunType.REAL ? 400_000_000_000_000 : 27;

  const intersections = permutations(input).filter(([a, b]) =>
    willCollideInBounds(a.coords, a.speed, b.coords, b.speed, lowerLimit, upperLimit)
  );

  return intersections.length;
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
