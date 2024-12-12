import { times } from 'ramda';
import { readFile } from '~utils/core';

type Input = number[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(' ').map(Number))[0];
}

function blinkAtStone(stone: number): number[] {
  const stoneStr = `${stone}`;
  if (stone === 0) {
    return [1];
  } else if (stoneStr.length % 2) {
    return [stone * 2024];
  } else {
    const middle = stoneStr.length / 2;
    return [stoneStr.slice(0, middle), stoneStr.slice(middle)].map(Number);
  }
}

function countStones(
  stones: number[],
  blinksRemaining: number,
  cache: Record<number, Record<number, number>>
): number {
  if (blinksRemaining === 0) {
    return stones.length;
  }

  return stones.reduce((acc, stone) => {
    if (!cache[blinksRemaining]) {
      cache[blinksRemaining] = {};
    }

    const cachedCount = cache[blinksRemaining][stone];
    if (cachedCount) {
      return acc + cachedCount;
    }

    const newCount = countStones(blinkAtStone(stone), blinksRemaining - 1, cache);

    cache[blinksRemaining][stone] = newCount;
    return acc + newCount;
  }, 0);
}

// ---- Part A ----
export function partA(input: Input): number {
  return countStones(input, 25, {});
}

// ---- Part B ----
export function partB(input: Input): number {
  return countStones(input, 75, {});
}
