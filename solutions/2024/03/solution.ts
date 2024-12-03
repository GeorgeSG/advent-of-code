import { readFile } from '~utils/core';

type Input = string;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).join();
}

// Utils
function extractMul(input: string): [number, number] {
  const [, a, b] = input.match(/mul\((\d+),(\d+)\)/).map(Number);
  return [a, b];
}

function mul(input: string): number {
  const [a, b] = extractMul(input);
  return a * b;
}

// ---- Part A ----
export function partA(input: Input): number {
  const matches = input.match(/mul\(\d+,\d+\)/g);
  return matches.reduce((acc, match) => acc + mul(match), 0);
}

// ---- Part B ----
export function partB(input: Input): number {
  const matches = input.match(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g);

  let enabled = true;

  return matches.reduce((acc, match) => {
    switch (match) {
      case 'do()':
        enabled = true;
        return acc;
      case "don't()":
        enabled = false;
        return acc;
      default:
        return enabled ? acc + mul(match) : acc;
    }
  }, 0);
}
