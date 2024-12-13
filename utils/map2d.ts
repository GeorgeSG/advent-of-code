import { debug2D, ijMeBro } from './arrays';
import { Point, Point2D, findAdjacent, findAdjacentAll } from './points';

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

  findAdjacent({ x, y }: Point2D): Point[] {
    return findAdjacent({ x, y }, this.input).map((p) => new Point(p.x, p.y));
  }

  findAdjacentAll({ x, y }: Point2D): Point[] {
    return findAdjacentAll({ x, y }, this.input).map((p) => new Point(p.x, p.y));
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

  set({ x, y }: Point | Point2D, value: T): void {
    this.input[x][y] = value;
  }

  isValid({ x, y }: Point | Point2D): boolean {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
  }

  debug(separator = '', indicators = false, padEnd = 2): void {
    debug2D(this.input, separator, indicators, padEnd);
  }
}
