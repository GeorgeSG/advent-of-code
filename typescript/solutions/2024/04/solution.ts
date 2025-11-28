import { has, transpose } from 'ramda';
import { readFile } from '~utils/core';

type Input = string[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).map((line) => line.split(''));
}

function xmasCount(value: string): number {
  return (value.match(/XMAS/g)?.length ?? 0) + (value.match(/SAMX/g)?.length ?? 0);
}

function hasMas(value: string): boolean {
  return value === 'MAS' || value === 'SAM';
}

// ---- Part A ----
export function partA(input: Input): number {
  const vertical = transpose(input);
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    count += xmasCount(input[i].join(''));
  }

  for (let i = 0; i < vertical.length; i++) {
    count += xmasCount(vertical[i].join(''));
  }

  for (let i = 0; i < input.length - 3; i++) {
    for (let j = 0; j < input[0].length - 3; j++) {
      const word = `${input[i][j]}${input[i + 1][j + 1]}${input[i + 2][j + 2]}${
        input[i + 3][j + 3]
      }`;
      count += xmasCount(word);
    }

    for (let j = 3; j < input[0].length; j++) {
      const word = `${input[i][j]}${input[i + 1][j - 1]}${input[i + 2][j - 2]}${
        input[i + 3][j - 3]
      }`;
      count += xmasCount(word);
    }
  }

  return count;
}

// ---- Part B ----
export function partB(input: Input): number {
  let count = 0;

  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input.length - 1; j++) {
      const diag1 = `${input[i - 1][j - 1]}${input[i][j]}${input[i + 1][j + 1]}`;
      const diag2 = `${input[i - 1][j + 1]}${input[i][j]}${input[i + 1][j - 1]}`;

      if (hasMas(diag1) && hasMas(diag2)) {
        count++;
      }
    }
  }
  return count;
}
