import { product } from 'ramda';
import { readFile } from '~utils/core';

type Input = string[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(':')[1]);
}

function findPossibleRecords(time: number, distance: number): number {
  let records = 0;

  let speed = time;
  while (speed--) {
    if (speed * (time - speed) > distance) {
      records++;
    }
  }

  return records;
}

// ---- Part A ----
export function partA(input: Input): number {
  const parseLine = (line: string) => (line.match(/\d+/g) || []).map(Number);
  const [times, distances] = input.map(parseLine);

  return times.reduce((records, time, i) => records * findPossibleRecords(time, distances[i]), 1);
}

// ---- Part B ----
export function partB(input: Input): number {
  const parseLine = (line: string) => Number(line.replaceAll(' ', ''));
  const [time, distance] = input.map(parseLine);

  return findPossibleRecords(time, distance);
}
