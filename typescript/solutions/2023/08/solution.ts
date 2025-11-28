import { Part, RunContext, RunType } from 'cli/lib/solutionRunner';
import { until } from 'ramda';
import { readFile } from '~utils/core';
import { arrayLcm } from '~utils/numbers';

type Instruction = 0 | 1;
type Neighbors = Record<string, [string, string]>;

type Input = {
  instructions: Instruction[];
  neighbors: Neighbors;
};

// Parser
export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile);
  const instructions = lines[0].split('').map((c) => (c === 'L' ? 0 : 1) as Instruction);

  const neighbors = lines.slice(1).reduce((n, line) => {
    n[line.substring(0, 3)] = [line.substring(7, 10), line.substring(12, 15)];
    return n;
  }, {});

  return { instructions, neighbors };
}

const findDistance = (
  start: string,
  { neighbors, instructions }: Input,
  atEnd: (node: string) => boolean
): number =>
  until(
    () => atEnd(start),
    (instruction: number) => {
      const nextNode = instructions[instruction % instructions.length];
      start = neighbors[start][nextNode];
      return instruction + 1;
    }
  )(0);

// ---- Part A ----
export function partA(input: Input, { runType, runIndex }: RunContext): number {
  if (runType === RunType.EXAMPLE && runIndex === 2) {
    return NaN;
  }

  return findDistance('AAA', input, (node) => node === 'ZZZ');
}

// ---- Part B ----
export function partB(input: Input, { runType, runIndex }: RunContext): number {
  if (runType === RunType.EXAMPLE && runIndex !== 2) {
    return NaN;
  }

  const starts = Object.keys(input.neighbors).filter((node) => node.endsWith('A'));
  const distances = starts.map((start) => findDistance(start, input, (node) => node.endsWith('Z')));

  return arrayLcm(distances);
}
