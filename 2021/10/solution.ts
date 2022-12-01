import R from 'ramda';
import { sortNums } from '~utils/arrays';
import { readFile } from '~utils/core';

type Input = string[];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile);
}

const IS_OPENING = /[{<\(\[]/;
const CLOSE_TO_OPEN = { '}': '{', '>': '<', ')': '(', ']': '[' };
const OPEN_TO_CLOSE = { '{': '}', '<': '>', '(': ')', '[': ']' };

const CHAR_CORRUPTION_SCORE = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const CHAR_COMPLETION_SCORE = { ')': 1, ']': 2, '}': 3, '>': 4 };

const checkCorrupted = (line: string): string | undefined => {
  let lastOpen = [];

  return line.split('').find((char) => {
    if (char.match(IS_OPENING)) {
      lastOpen.push(char);
    } else {
      const openChar = CLOSE_TO_OPEN[char];
      return lastOpen.pop() !== openChar;
    }
  });
};

const computeCompleteScore = (line: string): number => {
  let lastOpen = [];

  line.split('').forEach((char) => {
    if (char.match(IS_OPENING)) {
      lastOpen.push(char);
    } else {
      lastOpen.pop();
    }
  });

  const completion = lastOpen.reverse().map((c) => OPEN_TO_CLOSE[c]);

  return completion.reduce((res, curr) => res * 5 + CHAR_COMPLETION_SCORE[curr], 0);
};

// ---- Part A ----
export function partA(input: Input) {
  return R.sum(
    input
      .map(checkCorrupted)
      .filter(Boolean)
      .map((c) => CHAR_CORRUPTION_SCORE[c])
  );
}

// ---- Part B ----
export function partB(input: Input) {
  const incomplete = input.filter((l) => checkCorrupted(l) === undefined);
  const completionScores = sortNums(incomplete.map(computeCompleteScore));

  return completionScores[Math.floor(completionScores.length / 2)];
}
