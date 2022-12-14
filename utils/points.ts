import { findMax } from './arrays';
import { toI } from './numbers';

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

  static fromArray([x, y]: number[]): Point {
    return new Point(x, y);
  }

  static fromKey(key: string): Point {
    return new Point(Number(key.split(',')[0]), Number(key.split(',')[1]));
  }

  toKey(): string {
    return `${this.x},${this.y}`;
  }

  add({ x, y }: Point): Point {
    return new Point(this.x + x, this.y + y);
  }
}
