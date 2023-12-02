import { readFile } from '~utils/core';

type Command = {
  cmd: string;
  amount: number;
};
type Input = Command[];

const lineParser = (line: string): Command => ({
  cmd: line.split(' ')[0],
  amount: parseInt(line.split(' ')[1]),
});

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, lineParser);
}

export function partA(input: Input): number {
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

export function partB(input: Input): number {
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
