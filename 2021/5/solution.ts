import path from 'path';
import { max, min } from 'ramda';
import { toI } from '../../utils/numbers';
import { readFile } from '../../utils/readFile';
import { timeAndPrint } from '../../utils/timeAndPrint';

// const inputFile = path.resolve(__dirname) + '/demo_input';
const inputFile = path.resolve(__dirname) + '/input';

type Point = [number, number];
type Range = { from: Point; to: Point };
type Input = Range[];

const lineParser = (line: string): Range => {
  const from = [line.split(',')[0], line.split(',')[1].split(' ')[0]].map(toI);
  const to = [line.split(' ')[2].split(',')[0], line.split(' ')[2].split(',')[1]].map(toI);

  return { from, to } as Range;
};

let inputData: Input = readFile(inputFile, lineParser);

const isDiagonal = ({ from, to }: Range) => Math.abs(to[0] - from[0]) === Math.abs(to[1] - from[1]);

function partA(input: Input) {
  const map = {};

  const lines = input.filter(
    ({ from, to }) => from[1] === to[1] || from[0] === to[0] || isDiagonal({ from, to }) // diagonals for partB
  );

  lines.forEach(({ from, to }) => {
    if (isDiagonal({ from, to })) {
      const xDir = from[0] < to[0] ? 1 : -1;
      const yDir = from[1] < to[1] ? 1 : -1;

      let x = from[0];
      let y = from[1];
      const key = `${x}-${y}`;
      map[key] = map[key] || 0;
      map[key] += 1;
      while (x !== to[0] && y !== to[1]) {
        x += 1 * xDir;
        y += 1 * yDir;

        const key = `${x}-${y}`;
        map[key] = map[key] || 0;
        map[key] += 1;
      }

      return;
    }

    const [minX, maxX] = [from[0], to[0]].sort((a, b) => a - b);
    const [minY, maxY] = [from[1], to[1]].sort((a, b) => a - b);

    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        const key = `${i}-${j}`;
        map[key] = map[key] || 0;
        map[key] += 1;
      }
    }
  });

  return Object.values(map).filter((v) => v > 1).length;
}

function partB(input: Input) {
  return 0;
}

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
