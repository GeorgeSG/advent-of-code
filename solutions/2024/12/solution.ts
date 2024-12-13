import { ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';
import { Direction } from '~utils/types';

type Input = Map2D;

// Parser
export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile, (line) => line.split(''));
  return new Map2D(lines);
}

function crawlCluster(map: Map2D, start: Point, visited: Set<string>, cluster: Set<string>) {
  const clusterValue = map.get(start);
  let queue = [start];

  while (queue.length) {
    const current = queue.shift();
    const key = current.toKey();

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (map.get(current) === clusterValue) {
      cluster.add(key);

      const neighbours = map
        .findAdjacent(current)
        .filter((neighbour) => map.get(neighbour) === clusterValue);

      queue = queue.concat(neighbours);
    }
  }

  return cluster;
}

function exploreRegions(map: Map2D): Record<string, Array<Set<string>>> {
  const visited = new Set<string>();
  const regions = {};

  map.forEach((point, value) => {
    if (visited.has(point.toKey())) {
      return;
    }

    regions[value] ||= [];
    regions[value].push(crawlCluster(map, point, visited, new Set<string>()));
  });

  return regions;
}

function findFences(clusterKey: string, point: Point, map: Map2D): number {
  const neighbours = map.findAdjacent(point).filter((point) => map.get(point) === clusterKey);
  return 4 - neighbours.length;
}

// up, right, down, left
const orderedNeighbors = [new Point(-1, 0), new Point(0, 1), new Point(1, 0), new Point(0, -1)];
// up right, down right, down left, up left
const diagonals = [new Point(-1, 1), new Point(1, 1), new Point(1, -1), new Point(-1, -1)];

function findCorners(cluster: Set<string>): number {
  return [...cluster].reduce((corners, point) => {
    const point2D = Point.fromKey(point);

    const availableNeighbours = orderedNeighbors.map((pointDelta) =>
      cluster.has(point2D.add(pointDelta).toKey())
    );

    const availableDiagonalNeighbours = diagonals.map((pointDelta) =>
      cluster.has(point2D.add(pointDelta).toKey())
    );

    return (
      corners +
      availableNeighbours.reduce((newCorners, isPresent, direction) => {
        const nextDirection = (direction + 1) % 4;
        if (
          (isPresent &&
            availableNeighbours[nextDirection] &&
            !availableDiagonalNeighbours[direction]) ||
          (!isPresent && !availableNeighbours[nextDirection])
        ) {
          return newCorners + 1;
        }

        return newCorners;
      }, 0)
    );
  }, 0);
}

// ---- Part A ----
export function partA(input: Input): number {
  const regionsPerKey = exploreRegions(input);
  let result = 0;

  Object.entries(regionsPerKey).forEach(([clusterKey, clusters]) => {
    clusters.forEach((cluster) => {
      const perimeter = [...cluster].reduce(
        (acc, point) => acc + findFences(clusterKey, Point.fromKey(point), input),
        0
      );

      result += cluster.size * perimeter;
    });
  });

  return result;
}

// ---- Part B ----
export function partB(input: Input): number {
  const regionsPerKey = exploreRegions(input);

  const allClusters = Object.values(regionsPerKey).flat();
  return allClusters.reduce((acc, cluster) => acc + cluster.size * findCorners(cluster), 0);
}
