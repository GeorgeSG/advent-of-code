import { ijMeBro } from './arrays';
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
