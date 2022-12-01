import path from 'path';
import R from 'ramda';
import { ijMeBro, sortNums } from '~utils/arrays';
import { readFile, timeAndPrint } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point2D } from '~utils/points';

type Input = number[][];

export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split('').map(toI));
}

function findAdjacent({ x, y }: Point2D, map: Input): Point2D[] {
  const res: Point2D[] = [];
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;

  if (y < maxY) res.push({ x, y: y + 1 });
  if (y !== 0) res.push({ x, y: y - 1 });
  if (x < maxX) res.push({ x: x + 1, y });
  if (x !== 0) res.push({ x: x - 1, y });

  return res;
}

function findAdjacentAll({ x, y }: Point2D, map: Input): Point2D[] {
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

const findLowestAdjacentValue = (point: Point2D, map: Input): number =>
  sortNums(findAdjacent(point, map).map(({ x, y }) => map[x][y]))[0];

const findLowPoints = (input: Input): Point2D[] => {
  const lowPoints: Point2D[] = [];
  ijMeBro(input, (x, y, value) => {
    if (value < findLowestAdjacentValue({ x, y }, input)) {
      lowPoints.push({ x, y });
    }
  });

  return lowPoints;
};

// ---- Part A ----
export function partA(input: Input) {
  return R.sum(findLowPoints(input).map(({ x, y }) => input[x][y] + 1));
}

// ---- Part B ----
function findBasin(lowPoint: Point2D, map: Input): Point2D[] {
  if (map[lowPoint.x][lowPoint.y] === 9) return [];

  let basin: Point2D[] = [lowPoint];

  let currentPoints = [lowPoint];
  let newPoints = [];
  do {
    currentPoints.forEach((point) => {
      const adj = findAdjacent(point, map).filter(
        // filter to points of +1 depth, but 9's do not count
        ({ x, y }) => map[x][y] === map[point.x][point.y] + 1 && map[x][y] !== 9
      );

      newPoints = R.uniq(newPoints.concat(adj));
    });

    basin = R.uniq(basin.concat(currentPoints));
    currentPoints = newPoints.slice();
    newPoints = [];
  } while (currentPoints.length > 0);

  return basin;
}

export function partB(input: Input) {
  const lowPoints = findLowPoints(input);
  const basinSizes = lowPoints.map((point) => findBasin(point, input).length);
  return R.product(sortNums(basinSizes, true).slice(0, 3));
}
