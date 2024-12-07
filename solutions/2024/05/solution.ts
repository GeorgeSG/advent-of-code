import { kMaxLength } from 'buffer';
import { sum } from 'ramda';
import { readFile } from '~utils/core';

type Input = {
  updates: number[][];
  rules: Record<number, number[]>;
};

// Parser
export function prepareInput(inputFile: string): Input {
  const file = readFile(inputFile);
  const separator = file.findIndex((line) => line.includes(','));

  const pages = file.slice(separator).map((line) => line.split(',').map(Number));

  const rules = file.slice(0, separator).reduce((curr, line) => {
    const [before, after] = line.split('|').map(Number);
    if (curr[before]) {
      curr[before].push(after);
    } else {
      curr[before] = [after];
    }

    return curr;
  }, {});

  return { updates: pages, rules };
}

function isPageInvalid(update: number[], rules: Record<number, number[]>): boolean {
  const outOfOrder = update.find((page, index) => {
    if (!rules[page]) {
      return false;
    }

    for (let i = 0; i < index; i++) {
      if (rules[page].includes(update[i])) {
        return true;
      }
    }

    return false;
  });

  return outOfOrder !== undefined;
}

function getMiddle(update: number[]): number {
  return update[Math.floor(update.length / 2)];
}

function getSumOfMiddles(updates: number[][]): number {
  return sum(updates.map(getMiddle));
}

function reorderUpdate(update: number[], rules: Record<number, number[]>): number[] {
  const ordered = [...update];

  // ¯\_(ツ)_/¯ if it works it works
  while (isPageInvalid(ordered, rules)) {
    for (let i = ordered.length - 1; i >= 0; i--) {
      const page = ordered[i];

      for (let j = 0; j < i; j++) {
        const nextPage = ordered[j];
        if (rules[page]?.includes(nextPage)) {
          ordered.splice(j, 1);
          ordered.splice(i, 0, nextPage);
          break;
        }
      }
    }
  }

  return ordered;
}

// ---- Part A ----
export function partA({ updates, rules }: Input): number {
  const validUpdates = updates.filter((update) => !isPageInvalid(update, rules));
  return getSumOfMiddles(validUpdates);
}

// ---- Part B ----
export function partB({ updates, rules }: Input): number {
  const invalidUpdates = updates.filter((update) => isPageInvalid(update, rules));
  const ordered = invalidUpdates.map((update) => reorderUpdate(update, rules));
  return getSumOfMiddles(ordered);
}
