import R from 'ramda';
import { readFile } from '~utils/core';

type Input = string[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile);
}

function desnafuDigit(digit: string): number {
  if (digit === '=') return -2;
  if (digit === '-') return -1;
  return Number(digit);
}

function snafuRemainder(remainder: number): string {
  if (remainder === 3) return '=';
  if (remainder > 3) return '-';
  return remainder.toString();
}

function desnafu(snafu: string): number {
  return snafu
    .split('')
    .reduce((res, char, i) => res + desnafuDigit(char) * Math.pow(5, snafu.length - i - 1), 0);
}

function snafu(n: number): string {
  let res = '';

  while (n > 0) {
    const remainder = n % 5;
    res += snafuRemainder(remainder);

    n += remainder === 3 ? 2 : 1;
    n = Math.floor(n / 5);
  }

  return R.reverse(res);
}

// ---- Part A ----
export function partA(input: Input): string {
  return snafu(R.sum(input.map(desnafu)));
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
