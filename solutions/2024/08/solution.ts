import { ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { Point } from '~utils/points';

type Input = {
  maxX: number;
  maxY: number;
  antennasPerFrequency: Record<string, Point[]>;
};

// Parser
export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile, (line) => line.split(''));

  const antennas = {};

  ijMeBro(lines, (i, j, char) => {
    if (char !== '.') {
      antennas[char] = antennas[char] ? [...antennas[char], new Point(i, j)] : [new Point(i, j)];
    }
  });

  return { antennasPerFrequency: antennas, maxX: lines.length, maxY: lines[0].length };
}

function findAntinode(point: Point, direction: Point, maxX: number, maxY: number): Point | null {
  const newPoint = point.add(direction);
  if (newPoint.x >= 0 && newPoint.y >= 0 && newPoint.x < maxX && newPoint.y < maxY) {
    return newPoint;
  }

  return null;
}

function findAntinodes(p1: Point, p2: Point, maxX: number, maxY: number): Set<string> {
  return new Set<string>(
    [
      findAntinode(p1, p1.subtract(p2), maxX, maxY)?.toKey(),
      findAntinode(p2, p2.subtract(p1), maxX, maxY)?.toKey(),
    ].filter(Boolean)
  );
}

function findAntinodesInDirection(
  start: Point,
  diff: Point,
  maxX: number,
  maxY: number
): Set<string> {
  const anitnodes = new Set<string>();
  let point = start;

  while (point !== null) {
    anitnodes.add(point.toKey());
    point = findAntinode(point, diff, maxX, maxY);
  }

  return anitnodes;
}

function findAllAntinodes(p1: Point, p2: Point, maxX: number, maxY: number): Set<string> {
  return new Set([
    ...findAntinodesInDirection(p1, p1.subtract(p2), maxX, maxY),
    ...findAntinodesInDirection(p2, p2.subtract(p1), maxX, maxY),
  ]);
}

function solve(
  { antennasPerFrequency, maxX, maxY }: Input,
  antinodeFn: (pointA: Point, pointB: Point, maxX: number, maxY: number) => Set<string>
): number {
  const anitnodes = new Set();

  Object.values(antennasPerFrequency).forEach((points) => {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const newAntinodes = antinodeFn(points[i], points[j], maxX, maxY);
        newAntinodes.forEach((node) => anitnodes.add(node));
      }
    }
  });

  return anitnodes.size;
}

// ---- Part A ----
export function partA(input: Input): number {
  return solve(input, findAntinodes);
}

// ---- Part B ----
export function partB(input: Input): number {
  return solve(input, findAllAntinodes);
}
