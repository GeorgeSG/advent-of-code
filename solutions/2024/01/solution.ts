import { readFile } from '~utils/core';

type Input = {
  listA: number[];
  listB: number[];
};

// Parser
export function prepareInput(inputFile: string): Input {
  const listA = [];
  const listB = [];

  readFile(inputFile).forEach((line) => {
    const [a, b] = line.replace(/\s+/g, ',').split(',').map(Number);
    listA.push(a);
    listB.push(b);
  });

  return { listA: listA.sort(), listB: listB.sort() };
}

// ---- Part A ----
export function partA({ listA, listB }: Input): number {
  return listA.reduce((result, curr, i) => result + Math.abs(listB[i] - curr), 0);
}

// ---- Part B ----
export function partB({ listA, listB }: Input): number {
  const similarities = {};

  return listA.reduce((result, num) => {
    if (!similarities[num]) {
      similarities[num] = num * listB.filter((n) => n === num).length;
    }

    return result + similarities[num];
  }, 0);
}
