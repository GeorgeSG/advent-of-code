import R from 'ramda';
import { findMax, ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point2D } from '~utils/points';

type Input = number[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split('').map(toI));
}

function isVisible(x: number, y: number, map: Input): boolean {
  const treeHeight = map[x][y];
  const maxX = map.length;
  const maxY = map[0].length;

  if (x === 0 || y === 0 || x === maxX - 1 || y === maxY - 1) return true;
  if (R.range(0, x).every((i) => map[i][y] < treeHeight)) return true;
  if (R.range(x + 1, maxX).every((i) => map[i][y] < treeHeight)) return true;
  if (R.range(0, y).every((i) => map[x][i] < treeHeight)) return true;
  if (R.range(y + 1, maxY).every((i) => map[x][i] < treeHeight)) return true;

  return false;
}

function computeScenicScore(x: number, y: number, map: Input): number {
  const treeHeight = map[x][y];
  const maxX = map.length;
  const maxY = map[0].length;

  if (x === 0 || y === 0 || x === maxX - 1 || y === maxY - 1) return 0;

  const exploreMap = {
    x: [-1, maxX, x], // direction 0 limit, direction 1 limit, start
    y: [-1, maxY, y], // direction 0 limit, direction 1 limit, start
  };

  const explore = (type: 'x' | 'y', direction: 0 | 1) => {
    let result = 0;
    const moveStep = direction === 0 ? -1 : 1;

    let i = exploreMap[type][2] + moveStep;
    while (i !== exploreMap[type][direction]) {
      result++;

      const compareWith = type === 'x' ? map[i][y] : map[x][i];
      if (compareWith >= treeHeight) break;

      i += moveStep;
    }

    return result;
  };

  return explore('x', 0) * explore('x', 1) * explore('y', 0) * explore('y', 1);
}

// ---- Part A ----
export function partA(input: Input): number {
  let visible = 0;
  ijMeBro(input, (i, j) => (visible += Number(isVisible(i, j, input))));

  return visible;
}

// ---- Part B ----
export function partB(input: Input): number {
  const scores = [];
  ijMeBro(input, (i, j) => {
    scores.push(computeScenicScore(i, j, input));
  });

  return findMax(scores);
}
