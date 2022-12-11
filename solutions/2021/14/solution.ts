import R from 'ramda';
import { findMinMax } from '~utils/arrays';
import { readFile } from '~utils/core';
import { NumericMap } from '~utils/numericMap';

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
  let occurrences = new NumericMap<string>();
  let newOccurrences = new NumericMap<string>();

  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i + 2);
    occurrences.inc(pair, 1);
  }

  R.range(0, times).forEach(() => {
    occurrences.keys().forEach((pair) => {
      if (!rules[pair]) {
        return;
      }

      const newLetter = rules[pair];
      const pairA = `${pair.charAt(0)}${newLetter}`;
      const pairB = `${newLetter}${pair.charAt(1)}`;

      newOccurrences.inc(pairA, occurrences.get(pair));
      newOccurrences.inc(pairB, occurrences.get(pair));
    });

    occurrences = new NumericMap<string>(0, newOccurrences);
    newOccurrences = new NumericMap();
  });

  const byLetter = new NumericMap<string>();
  occurrences.keys().forEach((pair) => {
    const [a, b] = pair.split('');
    byLetter.inc(a, occurrences.get(pair) / 2);
    byLetter.inc(b, occurrences.get(pair) / 2);
  });

  const countPerLetter = byLetter.values().map(Math.ceil);
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
