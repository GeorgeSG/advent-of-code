import { range, sum } from 'ramda';
import { readFile } from '~utils/core';

type Input = {
  patterns: string[];
  designs: string[];
};

// Parser
export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile);

  return {
    patterns: lines[0].split(', '),
    designs: lines.slice(1),
  };
}

function countWaysToBuildDesign(patterns: string[], design: string): number {
  const waysToBuildAtLength = Array(design.length + 1).fill(0);
  waysToBuildAtLength[0] = 1;

  range(1, design.length + 1).forEach((i) => {
    patterns.forEach((pattern) => {
      if (i >= pattern.length && design.slice(i - pattern.length, i) === pattern) {
        waysToBuildAtLength[i] += waysToBuildAtLength[i - pattern.length];
      }
    });
  });

  return waysToBuildAtLength[design.length];
}

// ---- Part A ----
export function partA({ patterns, designs }: Input): number {
  return designs.filter((design) => countWaysToBuildDesign(patterns, design)).length;
}

// ---- Part B ----
export function partB({ patterns, designs }: Input): number {
  return sum(designs.map((design) => countWaysToBuildDesign(patterns, design)));
}
