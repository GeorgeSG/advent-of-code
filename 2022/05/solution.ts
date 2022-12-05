import R from 'ramda';
import { readFile, readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';

type Command = {
  from: number;
  to: number;
  amount: number;
};

type Input = {
  stacks: string[];
  cmnds: Command[];
};

// Parser
export function prepareInput(inputFile: string): Input {
  const output = readFileRaw(inputFile).split('\n');

  const divider = output.findIndex((e) => e === '');

  const stackLines = output.slice(0, divider - 1);
  const stacks = R.transpose(stackLines.map((line) => line.split('')))
    .filter((line) => line.join('').match(/[A-Z]+/g))
    .map((l) => l.join('').trim());

  const moveLines = output.slice(divider + 1, output.length - 1);
  const cmnds = moveLines
    .map((line) => {
      const matches = line.match(/move ([\d]+) from ([\d]+) to ([\d]+)/);
      const [amount, from, to] = matches.slice(1, 4).map(toI);
      return { amount, from: from - 1, to: to - 1 };
    })
    .filter(Boolean);

  return { stacks, cmnds };
}

// ---- Part A ----
export function partA({ cmnds, stacks }: Input): string {
  cmnds.forEach(({ from, to, amount }) => {
    const moved = stacks[from].slice(0, amount);

    stacks[from] = stacks[from].slice(amount);
    stacks[to] = `${moved.split('').reverse().join('')}${stacks[to]}`;
  });

  return stacks.map((s) => s[0]).join('');
}

// ---- Part B ----
export function partB({ cmnds, stacks }: Input): string {
  cmnds.forEach(({ from, to, amount }) => {
    const moved = stacks[from].slice(0, amount);

    stacks[from] = stacks[from].slice(amount);
    stacks[to] = `${moved}${stacks[to]}`;
  });

  return stacks.map((s) => s[0]).join('');
}
