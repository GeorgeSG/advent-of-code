import path from 'path';
import R from 'ramda';
import { sortNums } from '~utils/arrays';
import { readFile, timeAndPrint } from '~utils/core';
import { toI } from '~utils/numbers';
import { Point2D } from '~utils/points';

// const INPUT_FILE = path.resolve(__dirname) + '/demo_input';
const INPUT_FILE = path.resolve(__dirname) + '/input';

type InputLine = number[];
type Input = InputLine[];

// Parser
const lineParser = (line: string): InputLine => line.split('').map(toI);

// Input Data
const INPUT_DATA: Input = readFile(INPUT_FILE, lineParser);

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

const findLowestAdjacentValue = (point: Point2D, map: Input): number =>
  sortNums(findAdjacent(point, map).map(({ x, y }) => map[x][y]))[0];

const findLowPoints = (input: Input): Point2D[] => {
  const lowPoints: Point2D[] = [];
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      if (input[x][y] < findLowestAdjacentValue({ x, y }, input)) {
        lowPoints.push({ x, y });
      }
    }
  }
  return lowPoints;
};

// ---- Part A ----
function partA(input: Input) {
  return R.sum(findLowPoints(input).map(({ x, y }) => input[x][y] + 1));
}

// ---- Part B ----
function findBasin(point: Point2D, map: Input): Point2D[] {
  if (map[point.x][point.y] === 9) return [];

  let basin: Point2D[] = [point];

  let currentPoints = [point];
  let newPoints = [];
  do {
    currentPoints.forEach((currentPoint) => {
      const adj = findAdjacent(currentPoint, map).filter(
        // filter to points of +1 depth, but 9's do not count
        ({ x, y }) => map[x][y] === map[currentPoint.x][currentPoint.y] + 1 && map[x][y] !== 9
      );

      newPoints = newPoints.concat(adj);
    });

    basin = R.uniq(basin.concat(currentPoints));
    currentPoints = newPoints.slice();
    newPoints = [];
  } while (currentPoints.length > 0);

  return basin;
}

function partB(input: Input) {
  const lowPoints = findLowPoints(input);
  const basinSizes = lowPoints.map((point) => findBasin(point, input).length);
  return R.product(sortNums(basinSizes, true).slice(0, 3));
}

timeAndPrint(
  () => partA(INPUT_DATA),
  () => partB(INPUT_DATA)
);
