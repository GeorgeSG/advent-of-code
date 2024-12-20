import { range, sum } from 'ramda';
import { readFile } from '~utils/core';

type Equation = {
  testValue: number;
  numbers: number[];
};

type Input = Equation[];

type Operator = (a: number, b: number) => number;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).map((line) => {
    const [testValue, equationString] = line.split(': ');
    return {
      testValue: Number(testValue),
      numbers: equationString.split(' ').map(Number),
    };
  });
}

function isPossible({ testValue, numbers }: Equation, operators: Operator[]): boolean {
  const remainingNumbers = numbers.slice(1);
  const permutations = range(0, Math.pow(operators.length, numbers.length - 1));

  return permutations.some((perm) => {
    // operator mask is a number in base of operators.length, e.g. something like 20012 in base 3
    const operatorMask = perm.toString(operators.length).padStart(numbers.length - 1, '0');

    const result = remainingNumbers.reduce((acc, number, i) => {
      const operator = operators[Number(operatorMask.charAt(i))];
      return operator(acc, number);
    }, numbers[0]);

    return result === testValue;
  });
}

function getTotalCalibrationResult(input: Input, operators: Operator[]) {
  const possibleEquations = input.filter((eq) => isPossible(eq, operators));
  return sum(possibleEquations.map(({ testValue }) => testValue));
}

// ---- Part A ----
export function partA(input: Input): number {
  const operators: Operator[] = [(a, b) => a + b, (a, b) => a * b];
  return getTotalCalibrationResult(input, operators);
}

// ---- Part B ----
export function partB(input: Input): number {
  const operators: Operator[] = [(a, b) => a + b, (a, b) => a * b, (a, b) => Number(`${a}${b}`)];
  return getTotalCalibrationResult(input, operators);
}
