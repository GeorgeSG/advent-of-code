import R from 'ramda';
import { findMin, ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { findAdjacent, fromKey, Point2D, toKey } from '~utils/points';

type Input = number[][];

const START = 'a'.charCodeAt(0) - 1;
const END = 'z'.charCodeAt(0) + 1;

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) =>
    line.split('').map((i) => {
      if (i === 'S') return START;
      if (i === 'E') return END;
      return i.charCodeAt(0);
    })
  );
}

function findMinDistanceNode(visited: Set<string>, dist: Record<string, number>): Point2D | null {
  let minDistance = Number.POSITIVE_INFINITY;
  let minDistKey = null;
  Object.entries(dist).forEach(([key, distance]) => {
    if (!visited.has(key) && distance <= minDistance) {
      minDistance = distance;
      minDistKey = key;
    }
  });

  return minDistKey === null ? null : fromKey(minDistKey);
}

function dijkstra(
  start: Point2D,
  map: Input,
  canVisit: (current: Point2D, neighbour: Point2D) => boolean
): Record<string, number> {
  const visited: Set<string> = new Set();
  const dist: Record<string, number> = {};
  ijMeBro(map, (x, y) => (dist[toKey({ x, y })] = Number.POSITIVE_INFINITY));

  dist[toKey(start)] = 0;

  let current: Point2D;
  while ((current = findMinDistanceNode(visited, dist))) {
    visited.add(toKey(current));

    const neighbours = findAdjacent(current, map).filter(
      (adjacent) => canVisit(current, adjacent) && !visited.has(toKey(adjacent))
    );

    neighbours.forEach((neighbour) => {
      if (dist[toKey(neighbour)] > dist[toKey(current)] + 1) {
        dist[toKey(neighbour)] = dist[toKey(current)] + 1;
      }
    });
  }

  return dist;
}

// ---- Part A ----
export function partA(input: Input): number {
  let start: Point2D;
  let end: Point2D;

  ijMeBro(input, (x, y, val) => {
    if (val === START) {
      start = { x, y };
    }
    if (val === END) {
      end = { x, y };
    }
  });

  const canVisit = (current: Point2D, neighbour: Point2D) =>
    input[current.x][current.y] + 1 >= input[neighbour.x][neighbour.y];

  const distances = dijkstra(start, input, canVisit);
  return distances[toKey(end)];
}

// ---- Part B ----
export function partB(input: Input): number {
  let starts: Point2D[] = [];
  let end: Point2D;
  const a = 'a'.charCodeAt(0);

  ijMeBro(input, (x, y, val) => {
    if (val === START || val === a) {
      starts.push({ x, y });
    }
    if (val === END) {
      end = { x, y };
    }
  });

  const canVisit = (current: Point2D, neighbour: Point2D) =>
    input[current.x][current.y] <= input[neighbour.x][neighbour.y] + 1;

  const distances = dijkstra(end, input, canVisit);
  const distancesToStarts = starts.map((start) => distances[toKey(start)]);

  return findMin(distancesToStarts);
}
