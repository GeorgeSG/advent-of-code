import R from 'ramda';
import { findMax, findMin, findMinMax } from '~utils/arrays';
import { readFile } from '~utils/core';

type Rules = Record<string, string>;
type Input = {
  template: string;
  rules: Rules;
};

// Parser
export function prepareInput(inputFile: string): Input {
  let template: string;
  const rules: Rules = {};

  readFile(inputFile, (line, i) => {
    if (i === 0) {
      template = line;
      return;
    }

    const [from, to] = line.split('->').map((value) => value.trim());
    rules[from] = to;
  });

  return { template, rules };
}

// Brute-force solution :)
// function step(template: string, rules: Rules): string {
//   let newTemplate = '';

//   for (let i = 0; i < template.length; i++) {
//     const pair = template.slice(i, i + 2);
//     if (rules[pair]) {
//       newTemplate = newTemplate.concat(`${pair[0]}${rules[pair]}`);
//     } else {
//       newTemplate = newTemplate.concat(pair);
//     }
//   }

//   return newTemplate;
// }

function runSteps(times: number, { template, rules }: Input): number {
  let occurrences: Map<string, number> = new Map();

  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i + 2);

    occurrences[pair] ||= 0;
    occurrences[pair] += 1;
  }

  let newOccurrences: Map<string, number> = new Map();
  R.range(0, times).forEach(() => {
    Object.keys(occurrences).forEach((pair) => {
      if (!rules[pair]) {
        return;
      }

      const newLetter = rules[pair];
      const pairA = `${pair.charAt(0)}${newLetter}`;
      const pairB = `${newLetter}${pair.charAt(1)}`;

      newOccurrences[pairA] ||= 0;
      newOccurrences[pairA] += occurrences[pair];

      newOccurrences[pairB] ||= 0;
      newOccurrences[pairB] += occurrences[pair];
    });

    occurrences = { ...newOccurrences };
    newOccurrences = new Map();
  });

  const byLetter: Record<string, number> = {};
  Object.keys(occurrences).forEach((pair) => {
    const [a, b] = pair.split('');

    byLetter[a] ||= 0;
    byLetter[a] += occurrences[pair] / 2;
    byLetter[b] ||= 0;
    byLetter[b] += occurrences[pair] / 2;
  });

  const countPerLetter = Object.values(byLetter).map(Math.ceil);
  const [min, max] = findMinMax(countPerLetter);
  return max - min;
}

// ---- Part A ----
export function partA(input: Input): number {
  return runSteps(10, input);
}

// ---- Part B ----
export function partB(input: Input): number {
  return runSteps(40, input);
}
