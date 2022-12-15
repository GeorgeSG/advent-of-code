import R from 'ramda';
import { findMax, sortNums } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { fromArray, Point2D } from '~utils/points';

type Input = { beacons: Point2D[][]; yToSearch: number; searchSpace: number };

// Parser
export function prepareInput(inputFile: string): Input {
  const beacons = readFile(inputFile, (line) =>
    R.splitAt(
      2,
      line
        .match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
        .slice(1, 5)
        .map(toI)
    ).map(fromArray)
  );

  const yToSearch = inputFile.includes('example') ? 10 : 2_000_000;
  const searchSpace = inputFile.includes('example') ? 20 : 4_000_000;

  return { beacons, yToSearch, searchSpace };
}

function distance(a: Point2D, b: Point2D): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function isSensorCovering(point: Point2D, sensor: Point2D, beacon: Point2D): boolean {
  return distance(sensor, beacon) >= distance(sensor, point);
}

// Returns the left and right index of the coverage of the sensor on line y
function sensorCoverageOnY(y: number, sensor: Point2D, range: number): [number, number] | null {
  const delta = range - Math.abs(sensor.y - y);
  return delta > 0 ? [sensor.x - delta, sensor.x + delta] : null;
}

// Simplifies an array of ranges ex: [[1, 2], [3, 4], [2, 4], [5, 6], [9, 9]] -> [[1, 6], [9, 9]]
function simplifyRanges(ranges: [number, number][]): [number, number][] {
  const sortedRanges = ranges.slice().sort((a, b) => a[0] - b[0]);
  const result = [sortedRanges[0]];

  for (let i = 1; i < ranges.length; i++) {
    const current = result[result.length - 1];
    const range = sortedRanges[i];

    if (range[0] <= current[1] + 1 && current[1] <= range[1]) {
      current[1] = range[1];
    } else if (range[0] > current[1]) {
      result.push(range);
    }
  }

  return result;
}

// ---- Part A ----
export function partA({ beacons, yToSearch }: Input): number {
  const xs = sortNums(
    beacons.flatMap(([sensor, beacon]) => [
      sensor.x - distance(sensor, beacon),
      sensor.x + distance(sensor, beacon),
    ])
  );
  const [lineStart, lineEnd] = [R.head(xs), R.last(xs)];

  const beaconsAtY = beacons
    .map(([_, beacon]) => beacon)
    .filter((beacon) => beacon.y === yToSearch)
    .map((beacon) => beacon.x);

  const r = R.range(lineStart, lineEnd + 1).filter((x) =>
    beacons.some(
      ([sensor, beacon]) =>
        isSensorCovering({ x, y: yToSearch }, sensor, beacon) && !beaconsAtY.includes(x)
    )
  ).length;

  return r;
}

// ---- Part B ----
export function partB({ beacons, searchSpace }: Input): number {
  for (let y = 0; y < searchSpace; y++) {
    const rangesOnY = beacons
      .map(([sensor, beacon]) => sensorCoverageOnY(y, sensor, distance(sensor, beacon)))
      .filter(Boolean);

    const simplified = simplifyRanges(rangesOnY);
    if (simplified.length > 1) {
      // the missing beacon's x is the gap between the ranges on line y
      return 4_000_000 * (simplified[0][1] + 1) + y;
    }
  }

  return 0;
}
