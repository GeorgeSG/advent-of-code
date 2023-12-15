import { readFileSync } from 'fs';
import { find, sum, transpose } from 'ramda';
import { debug2D } from '~utils/arrays';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';

type Pattern = string[][];
type Input = Pattern[];

// Parser
export function prepareInput(inputFile: string): Input {
  let input = readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });
  return input.split('\n\n').map((pattern) =>
    pattern
      .split('\n')
      .map((line) => line.trim().split(''))
      .filter((line) => line.length > 0)
  );
}

function findHorizontalReflections(pattern: Pattern): number {
  for (let x = 1; x < pattern.length; x++) {
    let hasReflection = true;
    let reflectionSpan = Math.min(x, pattern.length - x);
    for (let dx = 0; dx < reflectionSpan; dx++) {
      if (pattern[x + dx].join('') !== pattern[x - dx - 1].join('')) {
        hasReflection = false;
        break;
      }
    }
    if (hasReflection) {
      return x;
    }
  }
  return 0;
}

function getDifference(a: string, b: string) {
  return a.split('').filter((c, i) => c != b[i]).length;
}

function fixAndFindHorizontalReflections(pattern: Pattern) {
  for (let x = 1; x < pattern.length; x++) {
    let diff = 0;
    let reflectionSpan = Math.min(x, pattern.length - x);
    for (let dx = 0; dx < reflectionSpan; dx++) {
      diff += getDifference(pattern[x + dx].join(''), pattern[x - dx - 1].join(''));
      if (diff > 1) {
        break;
      }
    }
    if (diff === 1) {
      return x;
    }
  }
  return 0;
}

const findReflections = (findFn: (pattern: Pattern) => number) => (pattern: Pattern) => {
  const horizontalReflections = findFn(pattern);
  const verticalReflections = findFn(transpose(pattern));

  return horizontalReflections * 100 + verticalReflections;
};

// ---- Part A ----
export function partA(input: Input): number {
  return sum(input.map(findReflections(findHorizontalReflections)));
}

// ---- Part B ----
export function partB(input: Input): number {
  return sum(input.map(findReflections(fixAndFindHorizontalReflections)));
}
