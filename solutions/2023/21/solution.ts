import { uniq } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { fromKey } from '~utils/points';

type Input = Map2D;

// Parser
export function prepareInput(inputFile: string): Input {
  return new Map2D(readFile(inputFile, (line) => line.split('')));
}

// ---- Part A ----
export function partA(input: Input): number {
  const STEPS = 64;

  const start = input.findByValue('S');
  const startKey = start.toKey();

  let step = 0;
  let current = new Set<string>([startKey]);

  const map = new Map<string, string[]>();

  while (step < STEPS) {
    let next = new Set<string>();
    current.forEach((point) => {
      if (map.has(point)) {
        const cached = map.get(point);
        cached.forEach((p) => next.add(p));
        return cached;
      }

      const r = input
        .findAdjacent(fromKey(point))
        .filter((p) => input.isValid(p) && (input.get(p) === '.' || p.toKey() === startKey))
        .map((p) => p.toKey());

      map.set(point, r);
      r.forEach((p) => next.add(p));
      return r;
    });

    current = next;
    step++;
  }

  return current.size;
}

// ---- Part B ----
export function partB(input: Input): number {
  const STEPS = 26501365;
  return 0;
}
