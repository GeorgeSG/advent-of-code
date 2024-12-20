import { findMax } from './arrays';
import { Map2D } from './map2d';
import { toI } from './numbers';
import { Direction } from './types';

export type Point2D = { x: number; y: number };
export const ZERO: Point2D = { x: 0, y: 0 };

export function findAdjacent<T>({ x, y }: Point2D, map: T[][]): Point2D[] {
  const res: Point2D[] = [];
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;

  if (y < maxY) res.push({ x, y: y + 1 });
  if (y !== 0) res.push({ x, y: y - 1 });
  if (x < maxX) res.push({ x: x + 1, y });
  if (x !== 0) res.push({ x: x - 1, y });

  return res;
}

export function findAdjacentAll<T>({ x, y }: Point2D, map: T[][]): Point2D[] {
  const res: Point2D[] = [];
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;

  if (y < maxY) res.push({ x, y: y + 1 });
  if (y !== 0) res.push({ x, y: y - 1 });
  if (x < maxX) res.push({ x: x + 1, y });
  if (x !== 0) res.push({ x: x - 1, y });
  if (x < maxX && y < maxY) res.push({ x: x + 1, y: y + 1 });
  if (x !== 0 && y < maxY) res.push({ x: x - 1, y: y + 1 });
  if (x < maxX && y !== 0) res.push({ x: x + 1, y: y - 1 });
  if (x !== 0 && y !== 0) res.push({ x: x - 1, y: y - 1 });

  return res;
}

export function render(points: Point2D[]) {
  let output = '';
  const maxX = findMax(points.map(({ x }) => x));
  const maxY = findMax(points.map(({ y }) => y));

  for (let i = 0; i <= maxY; i++) {
    for (let j = 0; j <= maxX; j++) {
      const pointExists = points.find(({ x, y }) => x === j && y === i);
      output += pointExists ? '#' : '.';
    }
    output += '\n';
  }

  return output;
}

export function toKey({ x, y }: Point2D): string {
  return `${x},${y}`;
}

export function fromKey(key: string) {
  return { x: toI(key.split(',')[0]), y: toI(key.split(',')[1]) };
}

export function fromArray([x, y]: number[]): Point2D {
  return { x, y };
}

export function sumPoints(p1: Point2D, p2: Point2D): Point2D {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

export class Point {
  constructor(public x: number, public y: number) {}

  static fromKey(key: string): Point {
    return new Point(Number(key.split(',')[0]), Number(key.split(',')[1]));
  }

  toKey(): string {
    return `${this.x},${this.y}`;
  }

  isIn<T>(map: Map2D<T>) {
    return map.isValid(this);
  }

  add({ x, y }: Point | Point2D): Point {
    return new Point(this.x + x, this.y + y);
  }

  subtract({ x, y }: Point | Point2D): Point {
    return new Point(this.x - x, this.y - y);
  }

  move(direction: Direction, distance = 1): Point {
    switch (direction) {
      case Direction.UP:
        return this.add({ x: -1 * distance, y: 0 });
      case Direction.DOWN:
        return this.add({ x: 1 * distance, y: 0 });
      case Direction.LEFT:
        return this.add({ x: 0, y: -1 * distance });
      case Direction.RIGHT:
        return this.add({ x: 0, y: 1 * distance });
    }
  }

  distanceTo({ x, y }: Point | Point2D): number {
    return Math.abs(this.x - x) + Math.abs(this.y - y);
  }

  toString(): string {
    return this.toKey();
  }

  equals({ x, y }: Point2D): boolean {
    return this.x === x && this.y === y;
  }
}
