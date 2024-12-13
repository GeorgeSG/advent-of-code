import { splitAt, splitEvery, splitWhen, splitWhenever, sum } from 'ramda';
import { readFile } from '~utils/core';

type ClawMachine = {
  a: [number, number];
  b: [number, number];
  prize: [number, number];
};

type Input = ClawMachine[];

// Parser
function parseButton(line: string): [number, number] {
  const [_, x, y] = line.match(/X\+(\d+), Y\+(\d+)/);
  return [Number(x), Number(y)];
}

function parsePrize(line: string): [number, number] {
  const [_, x, y] = line.match(/X=(\d+), Y=(\d+)/);
  return [Number(x), Number(y)];
}

export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile);

  return splitEvery(3, lines).map(([a, b, prize]) => ({
    a: parseButton(a),
    b: parseButton(b),
    prize: parsePrize(prize),
  }));
}

function getMachinePrice(machine: ClawMachine, offset = 0): number | null {
  const [aX, aY] = machine.a;
  const [bX, bY] = machine.b;
  const [targetX, targetY] = machine.prize.map((p) => p + offset);

  const b = (aX * targetY - aY * targetX) / (aX * bY - aY * bX);
  const a = (targetX - b * bX) / aX;

  return Number.isInteger(a) && Number.isInteger(b) ? 3 * a + b : 0;
}

// ---- Part A ----
export function partA(input: Input): number {
  return sum(input.map((m) => getMachinePrice(m)));
}

// ---- Part B ----
export function partB(input: Input): number {
  return sum(input.map((m) => getMachinePrice(m, 10_000_000_000_000)));
}
