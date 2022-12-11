import R from 'ramda';
import { sortNums } from '~utils/arrays';
import { EXAMPLE_MONKEYS, REAL_MONKEYS } from './hardcoded_input';

export type Monkey = {
  worryPerItem: number[];
  worryIncreaser(previousWorry: number): number;
  worryCheck: number;
  ifTrue: number;
  ifFalse: number;
};

// Parser
export function prepareInput(inputFile: string): Monkey[] {
  return R.clone(inputFile.includes('example') ? EXAMPLE_MONKEYS : REAL_MONKEYS);
}

function computeRound(
  monkeys: Monkey[],
  throws: number[],
  meditationRoutine: number,
  worryModifier: (worry: number) => number
) {
  monkeys.forEach((monkey, monkeyIndex) => {
    throws[monkeyIndex] += monkey.worryPerItem.length;
    monkey.worryPerItem.forEach((worry) => {
      const newWorry = worryModifier(monkey.worryIncreaser(worry)) % meditationRoutine;

      const targetMonkey = newWorry % monkey.worryCheck === 0 ? monkey.ifTrue : monkey.ifFalse;
      monkeys[targetMonkey].worryPerItem.push(newWorry);
    });
    monkey.worryPerItem = [];
  });
}

function computeMonkeyBusiness(
  monkeys: Monkey[],
  rounds: number,
  worryModifier: (worry: number) => number
) {
  const throws = monkeys.map(() => 0);
  const meditationRoutine = R.product(monkeys.map((m) => m.worryCheck));

  R.range(0, rounds).forEach(() => computeRound(monkeys, throws, meditationRoutine, worryModifier));

  const sorted = sortNums(throws);
  return sorted[sorted.length - 2] * sorted[sorted.length - 1];
}

// ---- Part A ----
export function partA(monkeys: Monkey[]): number {
  return computeMonkeyBusiness(monkeys, 20, (worry) => Math.floor(worry / 3));
}

// ---- Part B ----
export function partB(monkeys: Monkey[]): number {
  return computeMonkeyBusiness(monkeys, 10000, R.identity);
}
