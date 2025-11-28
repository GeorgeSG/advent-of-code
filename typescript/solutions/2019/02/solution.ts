import { ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = number[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(',').map(toI))[0];
}

function compute(operations: number[], noun: number, verb: number): number {
  let memory = [...operations];
  memory[1] = noun;
  memory[2] = verb;
  let pointer = 0;

  while (memory[pointer] !== 99) {
    if (memory[pointer] === 1) {
      memory[memory[pointer + 3]] = memory[memory[pointer + 1]] + memory[memory[pointer + 2]];
    } else if (memory[pointer] === 2) {
      memory[memory[pointer + 3]] = memory[memory[pointer + 1]] * memory[memory[pointer + 2]];
    }
    pointer += 4;
  }

  return memory[0];
}

// ---- Part A ----
export function partA(input: Input): number {
  return compute(input, 12, 2);
}

// ---- Part B ----
export function partB(input: Input): number {
  const target = 19690720;

  for (let noun = 1; noun < 100; noun++) {
    for (let verb = 1; verb < 100; verb++) {
      if (compute(input, noun, verb) === target) {
        return 100 * noun + verb;
      }
    }
  }

  return 0;
}
