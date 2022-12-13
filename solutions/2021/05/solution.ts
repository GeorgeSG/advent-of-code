import { readFile } from '~utils/core';
import { numberCompare, toI } from '~utils/numbers';
import { NumericMap } from '~utils/numericMap';

type Point = [number, number];
type Range = { from: Point; to: Point };
type Input = Range[];

export function prepareInput(inputFile: string): Input {
  const lineParser = (line: string): Range => {
    const from = [line.split(',')[0], line.split(',')[1].split(' ')[0]].map(toI);
    const to = [line.split(' ')[2].split(',')[0], line.split(' ')[2].split(',')[1]].map(toI);

    return { from, to } as Range;
  };

  return readFile(inputFile, lineParser);
}

const isDiagonal = ({ from, to }: Range) => Math.abs(to[0] - from[0]) === Math.abs(to[1] - from[1]);

function solve(input: Input, rangeFilter: (range: Range) => boolean) {
  const map = new NumericMap<string>();

  const ranges = input.filter(rangeFilter);

  ranges.forEach(({ from, to }) => {
    if (isDiagonal({ from, to })) {
      const xDir = Math.sign(to[0] - from[0]);
      const yDir = Math.sign(to[1] - from[1]);

      let x = from[0];
      let y = from[1];
      map.inc(`${x}-${y}`, 1);

      while (x !== to[0] && y !== to[1]) {
        x += xDir;
        y += yDir;

        map.inc(`${x}-${y}`, 1);
      }

      return;
    }

    const [minX, maxX] = [from[0], to[0]].sort(numberCompare());
    const [minY, maxY] = [from[1], to[1]].sort(numberCompare());

    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        map.inc(`${i}-${j}`, 1);
      }
    }
  });

  return map.values().filter((v) => v > 1).length;
}

export function partA(input: Input): number {
  return solve(input, ({ from, to }) => from[1] === to[1] || from[0] === to[0]);
}

export function partB(input: Input): number {
  // diagonals for partB)
  return solve(
    input,
    ({ from, to }) => from[1] === to[1] || from[0] === to[0] || isDiagonal({ from, to })
  );
}
