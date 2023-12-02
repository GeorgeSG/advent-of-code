import R from 'ramda';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type ValueMonkey = {
  type: 'value';
  value: number;
};
type OperatorMonkey = {
  type: 'op';
  operands: string[];
  op: string;
};

type Monkey = ValueMonkey | OperatorMonkey;
type Input = Record<string, Monkey>;

// Parser
export function prepareInput(inputFile: string): Input {
  const input: Input[] = readFile(inputFile, (line) => {
    const name = line.slice(0, 4);
    const rest = line.slice(6);

    if (rest.length < 10) {
      return { [name]: { type: 'value', value: toI(rest) } };
    } else {
      return {
        [name]: {
          type: 'op',
          op: rest.charAt(5),
          operands: [rest.slice(0, 4), rest.slice(7, 11)],
        },
      };
    }
  });

  return R.mergeAll<Input>(input);
}

function queryMonkey(monkeyName: string, monkeys: Input): number {
  const monkey = monkeys[monkeyName];

  if (monkey.type === 'value') {
    return monkey.value;
  }

  const a = queryMonkey(monkey.operands[0], monkeys);
  const b = queryMonkey(monkey.operands[1], monkeys);

  switch (monkey.op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
  }
}

// ---- Part A ----
export function partA(monkeys: Input): number {
  return queryMonkey('root', monkeys);
}

// ---- Part B ----
export function partB(monkeys: Input): number {
  const hasHumanInTheLoop = (monkeyName: string): boolean => {
    if (monkeyName === 'humn') return true;

    const monkey = monkeys[monkeyName];
    if (monkey.type === 'value') return false;

    return monkey.operands.some(hasHumanInTheLoop);
  };

  const computeHuman = (monkeyName: string, expectedValue: number): number => {
    const monkey = monkeys[monkeyName];

    if (monkeyName === 'humn') return expectedValue;
    if (monkey.type === 'value') return monkey.value;

    let humanIndex, nonHumanIndex;
    if (hasHumanInTheLoop(monkey.operands[0])) {
      [humanIndex, nonHumanIndex] = [0, 1];
    } else {
      [humanIndex, nonHumanIndex] = [1, 0];
    }

    const val = queryMonkey(monkey.operands[nonHumanIndex], monkeys);

    const monkeyWithHuman = monkey.operands[humanIndex];

    if (monkeyName === 'root') {
      return computeHuman(monkeyWithHuman, -1 * val);
    }

    switch (monkey.op) {
      case '+':
        return computeHuman(monkeyWithHuman, expectedValue - val);
      case '-':
        return computeHuman(monkeyWithHuman, expectedValue + val);
      case '*':
        return computeHuman(monkeyWithHuman, expectedValue / val);
      case '/':
        return computeHuman(monkeyWithHuman, expectedValue * val);
    }
  };

  return computeHuman('root', 0);
}
