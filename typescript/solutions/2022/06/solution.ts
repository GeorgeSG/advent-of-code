import R from 'ramda';
import { readFile } from '~utils/core';

type Input = string;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile)[0];
}

function findMarker(input: Input, markerLength: number): number {
  for (let i = markerLength; i < input.length; i++) {
    const letters = input.slice(i - markerLength, i).split('');
    if (R.uniq(letters).length === markerLength) {
      return i;
    }
  }

  return 0;
}

// ---- Part A ----
export function partA(input: Input): number {
  return findMarker(input, 4);
}

// ---- Part B ----
export function partB(input: Input): number {
  return findMarker(input, 14);
}
