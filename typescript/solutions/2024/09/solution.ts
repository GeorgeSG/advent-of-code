import { range, sum, times } from 'ramda';
import { readFile } from '~utils/core';

type Input = string;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile)[0];
}

function buildFilesystem(input: Input): string[] {
  const filesystem: string[] = [];
  let id = 0;

  input.split('').forEach((char, i) => {
    if (i % 2 === 0) {
      times(() => filesystem.push(id.toString()), Number(char));
      id += 1;
    } else {
      times(() => filesystem.push('.'), Number(char));
    }
  });

  return filesystem;
}

function computeChecksum(filesystem: string[]): number {
  return filesystem.reduce((acc, char, i) => (char === '.' ? acc : acc + Number(char) * i), 0);
}

// ---- Part A ----
export function partA(input: Input): number {
  let filesystem = buildFilesystem(input);

  while (true) {
    const replace = filesystem.indexOf('.');
    if (replace === -1) {
      break;
    }

    filesystem[replace] = filesystem[filesystem.length - 1];
    filesystem.pop();
  }

  return computeChecksum(filesystem);
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
