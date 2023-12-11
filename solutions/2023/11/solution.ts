import { range, sum } from 'ramda';
import { readFile } from '~utils/core';
import { Point } from '~utils/points';

type Input = {
  galaxies: Point[];
  expandColumns: number[];
  expandRows: number[];
};

// Parser
export function prepareInput(inputFile: string): Input {
  const input = readFile(inputFile, (line) => line.split(''));

  const expandRows = input
    .map((row, i) => (row.every((char) => char === '.') ? i : -1))
    .filter((i) => i !== -1);

  const expandColumns = range(0, input[0].length)
    .map((y) => {
      const isColumnEmpty = range(0, input.length).every((x) => input[x][y] === '.');
      return isColumnEmpty ? y : -1;
    })
    .filter((i) => i !== -1);

  const galaxies = input.flatMap((row, x) =>
    [...row.join('').matchAll(/#/g)].map(({ index }) => new Point(x, index))
  );

  return { galaxies, expandColumns, expandRows };
}

function remapGalaxy(
  expandRows: number[],
  expandColumns: number[],
  { x, y }: Point,
  expansionRate: number
) {
  const newX = x + expandRows.filter((row) => row <= x).length * (expansionRate - 1);
  const newY = y + expandColumns.filter((column) => column <= y).length * (expansionRate - 1);
  return new Point(newX, newY);
}

function solve({ galaxies, expandRows, expandColumns }: Input, expansionRate: number): number {
  const remappedGalaxies = galaxies.map((g) =>
    remapGalaxy(expandRows, expandColumns, g, expansionRate)
  );

  const uniquePairs = remappedGalaxies.flatMap((galaxy1, index) =>
    remappedGalaxies.slice(index + 1).map((galaxy2) => [galaxy1, galaxy2])
  );

  return sum(uniquePairs.map(([galaxy1, galaxy2]) => galaxy1.distanceTo(galaxy2)));
}

// ---- Part A ----
export function partA(input: Input): number {
  return solve(input, 2);
}

// ---- Part B ----
export function partB(input: Input): number {
  return solve(input, 1_000_000);
}
