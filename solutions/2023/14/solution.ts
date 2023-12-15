import { range } from 'ramda';
import { debug2D, ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';

type Input = string[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(''));
}

// function that hashes a 2d array
function hash(input: Input): string {
  return input.map((line) => line.join('')).join('');
}
const cache: Map<string, number> = new Map();

function tiltNorth(input: Input): Input {
  ijMeBro(input, (x, y, el) => {
    if (el !== '.') {
      return;
    }
    for (let i = x + 1; i < input.length; i++) {
      if (input[i][y] === '#') {
        break;
      }
      if (input[i][y] === 'O') {
        input[x][y] = 'O';
        input[i][y] = '.';
        break;
      }
    }
  });

  return input;
}

function tiltWest(input: Input): Input {
  ijMeBro(input, (x, y, el) => {
    if (el !== '.') {
      return;
    }
    for (let i = y + 1; i < input.length; i++) {
      if (input[x][i] === '#') {
        break;
      }
      if (input[x][i] === 'O') {
        input[x][y] = 'O';
        input[x][i] = '.';
        break;
      }
    }
  });
  return input;
}

function tiltSouth(input: Input) {
  return tiltNorth(input.reverse()).reverse();
}

function tiltEast(input: Input) {
  let result = input.map((line) => line.reverse());
  return tiltWest(result).map((line) => line.reverse());
}

function cycle(input: Input): Input {
  let result = tiltNorth(input);
  result = tiltWest(result);
  result = tiltSouth(result);
  result = tiltEast(result);
  return result;
}

function getNorthernLoad(input: Input): number {
  return input.reduce(
    (sum, line, i) => sum + line.filter((c) => c === 'O').length * (input.length - i),
    0
  );
}

// ---- Part A ----
export function partA(input: Input): number {
  return getNorthernLoad(tiltNorth(input));
}

// ---- Part B ----
export function partB(input: Input): number {
  let result = input;
  let cycleStart;
  let cycleLength;
  for (let i = 1; i < 1_000_000_001; i++) {
    result = cycle(result);
    const hashResult = hash(result);
    if (cache.has(hashResult)) {
      cycleStart = cache.get(hashResult);
      cycleLength = i - cycleStart;
      break;
    } else {
      cache.set(hashResult, i);
    }
  }

  let remainingCyclesAfterLoop = (1_000_000_000 - cycleStart) % cycleLength;
  range(0, remainingCyclesAfterLoop).forEach(() => (result = cycle(result)));

  return getNorthernLoad(result);
}
