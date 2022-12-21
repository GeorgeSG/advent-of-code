import R from 'ramda';
import { readFile } from '~utils/core';
import { CyclicalLinkedList, Node } from '~utils/cyclicalLinkedList';
import { toI } from '~utils/numbers';

type Input = number[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => toI(line));
}

function mix(nodeList: Node<number>[], list: CyclicalLinkedList<number>) {
  nodeList.forEach((node) => {
    let current = node;
    const value = node.value;
    if (value === 0) return;

    let moveSteps = Math.abs(value) % (list.size - 1);
    let direction = value > 0 ? 'next' : 'prev';

    // if going backwards, we need to insert after the element prior to the lastStep
    if (direction === 'prev') moveSteps += 1;

    R.range(0, moveSteps).forEach(() => (current = current[direction]));

    list.remove(node);
    list.insertNodeAfter(current, node);
  });
}

function solve(list: CyclicalLinkedList<number>, mixTimes: number): number {
  const nodes = list.nodes;
  R.range(0, mixTimes).forEach(() => mix(nodes, list));

  const values = list.values;
  const zero = values.findIndex((val) => val === 0);

  return R.sum([1000, 2000, 3000].map((offset) => values[(zero + offset) % values.length]));
}

// ---- Part A ----
export function partA(input: Input): number {
  const list = CyclicalLinkedList.fromArray(input);

  return solve(list, 1);
}

// ---- Part B ----
const DECRYPTION_KEY = 811589153;
export function partB(input: Input): number {
  const list = CyclicalLinkedList.fromArray(input.map((n) => n * DECRYPTION_KEY));

  return solve(list, 10);
}
