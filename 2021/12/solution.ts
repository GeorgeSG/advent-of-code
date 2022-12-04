import R from 'ramda';
import { readFile } from '~utils/core';

type Node = string;
type Route = Node[];
type Input = Record<Node, Node[]>;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).reduce((map, line) => {
    const [start, end] = line.split('-');
    map[start] = [...(map[start] || []), end];
    map[end] = [...(map[end] || []), start];
    return map;
  }, {});
}

const isLowercase = (node: string) => node.toLowerCase() === node;

function dfs(
  node: Node,
  route: Route,
  result: Route[],
  availableNodes: (node: Node, route: Route) => Node[]
) {
  if (node === 'end') {
    result.push(route);
    return;
  }

  availableNodes(node, route).forEach((adjacentNode) =>
    dfs(adjacentNode, [...route, adjacentNode], result, availableNodes)
  );
}

// ---- Part A ----
export function partA(input: Input): number {
  let result = [];
  dfs('start', ['start'], result, (currentNode, route) =>
    R.without(route.filter(isLowercase), input[currentNode])
  );

  return result.length;
}

// ---- Part B ----
export function partB(input: Input): number {
  let result = [];

  dfs('start', ['start'], result, (currentNode: Node, route: Route) => {
    const lowcases = route.filter(isLowercase);
    const canRepeat = new Set(lowcases).size === lowcases.length;

    const availableNodes = input[currentNode].filter((node) => {
      if (node === 'start') return false;
      if (node === 'end' || node.toUpperCase() === node) return true;

      return isLowercase(node) && (R.count(R.equals(node), route) === 0 || canRepeat);
    });

    return availableNodes;
  });

  return result.length;
}
