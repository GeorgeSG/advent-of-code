import { uniq } from 'ramda';
import { readFile } from '~utils/core';

type Input = Record<string, string[]>;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split('-')).reduce((acc, [a, b]) => {
    acc[a] ||= [];
    acc[a].push(b);
    acc[b] ||= [];
    acc[b].push(a);
    return acc;
  }, {});
}

// ---- Part A ----
export function partA(input: Input): number {
  const viable = Object.keys(input).filter((pc) => input[pc].length > 1 && pc.startsWith('t'));

  const threes = new Set<string>();

  viable.forEach((pc) => {
    input[pc].forEach((secondPc) => {
      input[secondPc].forEach((thirdPc) => {
        if (thirdPc !== pc && input[thirdPc].includes(pc)) {
          threes.add([pc, secondPc, thirdPc].sort().join(','));
        }
      });
    });
  });

  return threes.size;
}

// ---- Part B ----

function getCluster(pc: string, input: Input): string[] {
  return input[pc]
    .flatMap((secondPc) => [
      pc,
      ...input[secondPc].filter((thirdPc) => thirdPc !== pc && input[pc].includes(thirdPc)),
    ])
    .filter(
      (secondPc, i, cluster) =>
        cluster.every((thirdPc) => thirdPc === secondPc || input[secondPc].includes(thirdPc)) &&
        cluster.indexOf(secondPc) === i
    );
}

export function partB(input: Input): string {
  const clusters = Object.keys(input).map((pc) => getCluster(pc, input));
  const largestNetwork = clusters.sort((a, b) => b.length - a.length)[0];
  return largestNetwork.sort().join(',');
}
