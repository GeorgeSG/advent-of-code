import R from 'ramda';
import { readFileRaw } from '~utils/core';
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
  const input = readFileRaw(inputFile).split('\n');

  const divider = input.findIndex((e) => e === '');

  const stackLines = input.slice(0, divider - 1);
  const stacks = R.transpose(stackLines.map((line) => line.split('')))
    .map((line) => line.join(''))
    .filter((line) => line.match(/[A-Z]+/g))
    .map((line) => line.trim());

  const moveLines = input.slice(divider + 1, input.length - 1);
  const cmnds = moveLines.map((line) => {
    const matches = line.match(/move ([\d]+) from ([\d]+) to ([\d]+)/);
    const [amount, from, to] = matches.slice(1, 4).map(toI);
    return { amount, from: from - 1, to: to - 1 };
  });

  return { stacks, cmnds };
}

function solve({ cmnds, stacks }: Input, canMoveMultiple = false) {
  cmnds.forEach(({ from, to, amount }) => {
    const moved = stacks[from].slice(0, amount);

    stacks[from] = stacks[from].slice(amount);
    if (canMoveMultiple) {
      stacks[to] = `${moved}${stacks[to]}`;
    } else {
      stacks[to] = `${R.reverse(moved)}${stacks[to]}`;
    }
  });

  return stacks.map((s) => s[0]).join('');
}

// ---- Part A ----
export function partA(input: Input): string {
  return solve(input);
}

// ---- Part B ----
export function partB(input: Input): string {
  return solve(input, true);
}
