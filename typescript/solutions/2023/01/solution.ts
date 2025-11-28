import R from 'ramda';
import { readFile } from '~utils/core';

type Input = string[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile);
}

// ---- Part A ----
export function partA(input: Input): number {
  return R.sum(
    input.map((line) => {
      const digits = line.match(/[0-9]/g);
      return Number(`${digits?.[0]}${digits?.slice(-1)}`);
    })
  );
}

// ---- Part B ----
export function partB(input: Input): number {
  const wordToDigit = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  const fixOverlaps = input.map((e) =>
    e
      .replace(/oneight/g, 'oneeight')
      .replace(/threeight/g, 'threeeight')
      .replace(/fiveight/g, 'fiveeight')
      .replace(/nineight/g, 'nineeight')
      .replace(/eightwo/g, 'eighttwo')
      .replace(/twone/g, 'twoone')
      .replace(/sevenine/g, 'sevennine')
  );

  return R.sum(
    fixOverlaps.map((line) => {
      const digits = line.match(/[0-9]|one|two|three|four|five|six|seven|eight|nine/g);

      const [first, last] = [
        wordToDigit[digits[0]] ?? digits[0],
        wordToDigit[digits.slice(-1)[0]] ?? digits.slice(-1)[0],
      ];

      return Number(`${first}${last}`);
    })
  );
}
