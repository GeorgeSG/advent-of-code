import { readFile } from '~utils/core';

type Operator = 'AND' | 'OR' | 'XOR';
type Connection = { a: string; b: string; op: Operator };
type Input = {
  values: Record<string, number>;
  connections: Record<string, Connection>;
};

// Parser
export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile);

  const values = lines
    .filter((line) => line.includes(':'))
    .reduce((acc, line) => {
      const [key, value] = line.split(': ');
      acc[key] = value;
      return acc;
    }, {});

  const connections = lines
    .filter((line) => line.includes('->'))
    .reduce((acc, line) => {
      const [left, c] = line.split(' -> ');
      const [a, op, b] = left.split(' ');
      acc[c] = { a, op: op as Operator, b };
      return acc;
    }, {});

  return { values, connections };
}

const OPERATOR_FN: Record<Operator, (a: number, b: number) => number> = {
  AND: (a: number, b: number) => a & b,
  OR: (a: number, b: number) => a | b,
  XOR: (a: number, b: number) => a ^ b,
};

function getResult(prefix: string, values: Record<string, number>): number {
  const value = Object.keys(values)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .reverse()
    .map((key) => values[key]);

  return parseInt(value.join(''), 2);
}

function computeValues({ values, connections }: Input): Record<string, number> {
  const allKeys = new Set(Object.keys(values).concat(Object.keys(connections)));

  while (Object.keys(values).length < allKeys.size) {
    Object.keys(connections)
      .filter((key) => {
        const { a, b } = connections[key];
        return values[a] !== undefined && values[b] !== undefined;
      })
      .forEach((key) => {
        const { a, b, op } = connections[key];
        values[key] = OPERATOR_FN[op](values[a], values[b]);
      });
  }

  return values;
}

// ---- Part A ----
export function partA(input: Input): number {
  const values = computeValues(input);
  return getResult('z', values);
}

// ---- Part B ----
export function partB({ values, connections }: Input, { runIndex }): number {
  return 0;
}
