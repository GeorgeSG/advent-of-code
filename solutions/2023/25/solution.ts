import { RunType } from 'cli/lib/solutionRunner';
import { readFile } from '~utils/core';

type Input = Record<string, string[]>;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).reduce((result, line) => {
    const [from, to] = line.split(': ');
    result[from] = (result[from] || []).concat(to.split(' '));
    return result;
  }, {} as Input);
}

function printGraphvizDot(input: Input) {
  console.log('digraph { layout=neato ');
  console.log(
    Object.keys(input)
      .map((key) => `{${key} -> {${input[key].join(' ')}}}`)
      .join(' ')
  );
  console.log('}');
}

// ---- Part A ----
export function partA(input: Input, { runType }: { runType: RunType }): number {
  const removeEdge = (v1: string, v2: string) => {
    if (input[v1]) {
      input[v1] = input[v1].filter((x) => x !== v2);
    }
    if (input[v2]) {
      input[v2] = input[v2].filter((x) => x !== v1);
    }
  };

  // printGraphvizDot(input);

  if (runType === RunType.REAL) {
    removeEdge('ldl', 'fpg');
    removeEdge('hcf', 'lhn');
    removeEdge('nxk', 'dfk');
  } else {
    removeEdge('cmg', 'bvb');
    removeEdge('pzl', 'hfx');
    removeEdge('jqt', 'nvd');
  }

  // Make edges bidirectional
  const allEdges = new Set<string>();

  Object.keys(input).forEach((from) => {
    allEdges.add(from);
    input[from].forEach((to) => {
      input[to] = [...(input[to] || []), from];
      allEdges.add(to);
    });
  });

  // BFS in a group containing a random vertex
  const visited = new Set<string>();
  let current = Object.keys(input)[0];
  let queue = [current];

  while (queue.length > 0) {
    visited.add(current);
    queue = queue.concat(input[current].filter((to) => !visited.has(to)));
    current = queue.shift();
  }

  return visited.size * (allEdges.size - visited.size);
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
