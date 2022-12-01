import path from 'path';
import { readFile, timeAndPrint } from '~utils/core';

const inputFile = path.resolve(__dirname) + '/input';

type Input = {
  cmd: string;
  amount: number;
};

const lineParser = (line: string): Input => ({
  cmd: line.split(' ')[0],
  amount: parseInt(line.split(' ')[1]),
});

let inputData: Input[] = readFile(inputFile, lineParser);

function partA(input: Input[]): number {
  let horizontal = 0;
  let depth = 0;

  input.forEach(({ cmd, amount }) => {
    if (cmd === 'forward') {
      horizontal += amount;
    } else {
      depth += amount * (cmd === 'down' ? 1 : -1);
    }
  });

  return horizontal * depth;
}

function partB(input: Input[]): number {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  input.forEach(({ cmd, amount }) => {
    if (cmd === 'forward') {
      horizontal += amount;
      depth += aim * amount;
    } else {
      aim += amount * (cmd === 'down' ? 1 : -1);
    }
  });

  return horizontal * depth;
}

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
