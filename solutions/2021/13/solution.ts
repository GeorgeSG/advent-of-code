import R from 'ramda';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point2D, render } from '~utils/points';

type Fold = { dir: 'x' | 'y'; value: number };
type Input = {
  points: Point2D[];
  folds: Fold[];
};

// Parser
export function prepareInput(inputFile: string): Input {
  const points: Input['points'] = [];
  const folds: Input['folds'] = [];

  readFile(inputFile, (line) => {
    if (line.startsWith('fold')) {
      folds.push({
        dir: line.split(' ')[2].split('=')[0],
        value: toI(line.split('=')[1]),
      });
    } else {
      const [x, y] = line.split(',').map(toI);
      points.push({ x, y });
    }
  });

  return { points, folds };
}

const shouldChange = (point: Point2D, { dir, value }: Fold) => point[dir] >= value;

const change = (point: Point2D, { dir, value }: Fold) => {
  if (!shouldChange(point, { dir, value })) {
    return point;
  }

  const newPoint = { ...point };
  if (!shouldChange(newPoint, { dir, value })) {
    return newPoint;
  }

  newPoint[dir] = newPoint[dir] - 2 * (newPoint[dir] - value);
  return newPoint;
};

const foldPoints = (points: Point2D[], fold: Fold): Point2D[] => {
  return R.uniq(points.map((point) => change(point, fold)));
};

// ---- Part A ----
export function partA({ points, folds }: Input): number {
  return foldPoints(points, folds[0]).length;
}

// ---- Part B ----
export function partB({ points, folds }: Input): number {
  const res = folds.reduce(foldPoints, points);
  console.log(render(res));
  return 0;
}
