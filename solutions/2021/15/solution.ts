import R from 'ramda';
import { findMin } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { findAdjacent, Point2D } from '~utils/points';

type Input = number[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split('').map(toI));
}

const toKey = ({ x, y }: Point2D) => `${x}-${y}`;
const fromKey = (key: string) => ({ x: toI(key.split('-')[0]), y: toI(key.split('-')[1]) });

function findMinVertex(visited: Record<string, boolean>, dist: Record<string, number>): Point2D {
  let minDistance = Number.POSITIVE_INFINITY;
  let minDistKey = null;
  Object.entries(dist).forEach(([key, distance]) => {
    if (!visited[key] && distance <= minDistance) {
      minDistance = distance;
      minDistKey = key;
    }
  });

  return fromKey(minDistKey);
}

function dijkstra(end: Point2D, input: Input): number {
  const start = { x: 0, y: 0 };

  const visited: Record<string, boolean> = {};
  const dist: Record<string, number> = {};
  dist[toKey(start)] = 0;

  while (true) {
    const current = findMinVertex(visited, dist);
    if (R.equals(current, end)) {
      return dist[toKey(end)];
    }

    visited[toKey(current)] = true;
    const adj = findAdjacent(current, input).filter((point) => !visited[toKey(point)]);

    adj.forEach((point) => {
      if (
        dist[toKey(current)] !== undefined &&
        (!dist[toKey(point)] || dist[toKey(point)] > dist[toKey(current)] + input[point.x][point.y])
      ) {
        dist[toKey(point)] = dist[toKey(current)] + input[point.x][point.y];
      }
    });
  }
}

// ---- Part A ----
export function partA(input: Input): number {
  const end = { x: input.length - 1, y: input[0].length - 1 };
  return dijkstra(end, input);
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
