import { findMax, ijMeBro } from './arrays';
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

  static fromKey(key: string): Point {
    return new Point(Number(key.split(',')[0]), Number(key.split(',')[1]));
  }

  toKey(): string {
    return `${this.x},${this.y}`;
  }

  isIn(map: Map2D) {
    return map.isValid(this);
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }

  add({ x, y }: Point | Point2D): Point {
    return new Point(this.x + x, this.y + y);
  }

  toString(): string {
    return this.toKey();
  }
}

export enum Direction {
  RIGHT = 'R',
  DOWN = 'D',
  LEFT = 'L',
  UP = 'U',
}

export class Map2D<T = string> {
  static fromLines<T>(lines: T[][]) {
    return new Map2D(lines.map((line) => [...line]));
  }

  constructor(private input: T[][]) {}

  get maxX(): number {
    return this.input.length - 1;
  }

  get maxY(): number {
    return this.input[0].length - 1;
  }

  findAdjacent({ x, y }: Point2D): Point2D[] {
    return findAdjacent({ x, y }, this.input);
  }

  findAdjacentAll({ x, y }: Point2D): Point2D[] {
    return findAdjacentAll({ x, y }, this.input);
  }

  findByValue(value: T): Point {
    for (let x = 0; x < this.input.length; x++) {
      for (let y = 0; y < this.input[0].length; y++) {
        if (this.input[x][y] === value) {
          return new Point(x, y);
        }
      }
    }
  }

  forEach(fn: (point: Point, value: T) => void): void {
    ijMeBro(this.input, (x, y, el) => fn(new Point(x, y), el));
  }

  reduce<R>(fn: (acc: R, point: Point, value: T) => R, initialValue: R): R {
    let acc = initialValue;
    this.forEach((point, value) => (acc = fn(acc, point, value)));
    return acc;
  }

  get({ x, y }: Point | Point2D): T {
    return this.input[x][y];
  }

  isValid({ x, y }: Point | Point2D): boolean {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
  }
}
