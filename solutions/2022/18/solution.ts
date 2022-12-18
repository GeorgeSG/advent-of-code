import { sumArrays } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = Set<string>;

// Parser
export function prepareInput(inputFile: string): Input {
  return new Set(readFile(inputFile));
}

// prettier-ignore
const DIRECTIONS_3D = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

const toKey = (coords: number[]) => coords.join(',');

function findTotalSurface(input: Input): number {
  return [...input.keys()].reduce((surface, cube) => {
    const coords = cube.split(',').map(toI);
    const coveredSides = DIRECTIONS_3D.filter((dir) => input.has(toKey(sumArrays(coords, dir))));
    return surface + 6 - coveredSides.length;
  }, 0);
}

// ---- Part A ----
export function partA(input: Input): number {
  return findTotalSurface(input);
}

function hasWallInDirection(coords: number[], input: Input, direction: number) {
  const newCoords = coords.slice();

  let val = coords[direction];
  do {
    val -= 1;
    if (val <= 0) return false;
    newCoords.splice(direction, 1, val);
  } while (!input.has(toKey(newCoords)));

  val = coords[direction];
  do {
    val += 1;
    if (val >= 20) return false;
    newCoords.splice(direction, 1, val);
  } while (!input.has(toKey(newCoords)));

  return true;
}

function isInPocket(coords: number[], input: Set<string>) {
  if (!hasWallInDirection(coords, input, 0)) return false;
  if (!hasWallInDirection(coords, input, 1)) return false;
  if (!hasWallInDirection(coords, input, 2)) return false;

  return true;
}

// ---- Part B ----
export function partB(input: Input): number {
  const surface = findTotalSurface(input);

  let pocketSides = 0;
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      for (let z = 0; z < 20; z++) {
        const coords = [x, y, z];
        if (input.has(toKey(coords))) {
          continue;
        }

        if (isInPocket(coords, input)) {
          const directions = DIRECTIONS_3D.map((direction) => sumArrays(coords, direction));
          const dirCount = directions.filter((direction) => input.has(toKey(direction)));
          pocketSides += dirCount.length;
        }
      }
    }
  }

  return surface - pocketSides;
}
