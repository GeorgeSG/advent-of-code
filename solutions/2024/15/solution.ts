import { dir } from 'console';
import { splitWhen } from 'ramda';
import { ijMeBro } from '~utils/arrays';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point } from '~utils/points';
import { Direction } from '~utils/types';

type Input = {
  map: Map2D<string>;
  moves: Direction[];
};

const EMPTY = '.';
const ROBOT = '@';
const WALL = '#';
const SMALL_BOX = 'O';
const BOX_LEFT = '[';
const BOX_RIGHT = ']';

// Parser
export function prepareInput(inputFile: string): Input {
  const lines = readFile(inputFile);

  const [mapInput, directionInput] = splitWhen(
    (line) => ['<', '>', '^', 'v'].includes(line.charAt(0)),
    lines
  );

  const moves = directionInput
    .join('')
    .split('')
    .map((c) => {
      switch (c) {
        case '<':
          return Direction.LEFT;
        case '>':
          return Direction.RIGHT;
        case '^':
          return Direction.UP;
        case 'v':
          return Direction.DOWN;
        default:
          throw new Error(`Invalid direction ${c}`);
      }
    });

  return {
    map: new Map2D(mapInput.map((line) => line.split(''))),
    moves,
  };
}

function getGPSCoordinates(map: Map2D<string>, valueTarget: string): number {
  return map.reduce((acc, { x, y }, value) => (value === valueTarget ? acc + x * 100 + y : acc), 0);
}

// Applies only to Part B
function getItemsToMove(map: Map2D<string>, points: Point[], direction: Direction): Point[] {
  let current = [...points];
  let itemsToMove = [...current];
  while (true) {
    const nextPoints = current.map((point) => point.move(direction));

    // make sure all pairs are present
    nextPoints.forEach((point) => {
      const pointValue = map.get(point);
      const nextPointsKeys = nextPoints.map((p) => p.toKey());
      let potentialAdjacentPoint;

      if (pointValue === BOX_LEFT) potentialAdjacentPoint = point.move(Direction.RIGHT);
      if (pointValue === BOX_RIGHT) potentialAdjacentPoint = point.move(Direction.LEFT);

      if (potentialAdjacentPoint && !nextPointsKeys.includes(potentialAdjacentPoint.toKey())) {
        nextPoints.push(potentialAdjacentPoint);
      }
    });

    const nextValues = nextPoints.map((point) => map.get(point));

    if (nextValues.includes(WALL)) {
      // hit a wall, move nothing
      return [];
    }

    if (nextValues.every((value) => value === EMPTY)) {
      // everything is empty, move all
      return itemsToMove;
    }

    const newNext = [...nextPoints];

    if (nextValues[0] === BOX_RIGHT) {
      newNext.unshift(nextPoints[0].move(Direction.LEFT));
    }

    if (nextValues[nextValues.length - 1] === BOX_LEFT) {
      newNext.push(nextPoints[nextPoints.length - 1].move(Direction.RIGHT));
    }

    current = newNext.filter((point) => [BOX_RIGHT, BOX_LEFT].includes(map.get(point)));
    itemsToMove = itemsToMove.concat(current);
  }
}

function moveRobot(map: Map2D<string>, direction: Direction): void {
  let itemsToMove = [];
  const robot = map.findByValue(ROBOT);

  let curr = robot;

  while (true) {
    let value = map.get(curr);

    if (value === WALL) {
      // Hit a wall, not moving anything
      return;
    }

    if (value === EMPTY) {
      // Reached empty row, start moving
      break;
    }

    if (value === ROBOT || value === SMALL_BOX) {
      itemsToMove.push(curr);
      curr = curr.move(direction);
      continue;
    }

    const lastOfPair =
      value === BOX_LEFT
        ? curr.move(Direction.RIGHT)
        : value === BOX_RIGHT
        ? curr.move(Direction.LEFT)
        : null;

    if (!lastOfPair) {
      curr = curr.move(direction);
      continue;
    }

    if ([Direction.UP, Direction.DOWN].includes(direction)) {
      const pair = value === BOX_LEFT ? [curr, lastOfPair] : [lastOfPair, curr];

      const newItemsToMove = getItemsToMove(map, pair, direction);
      if (newItemsToMove.length === 0) {
        return;
      }

      itemsToMove = itemsToMove.concat(newItemsToMove);
    } else {
      itemsToMove = itemsToMove.concat([curr, lastOfPair]);
      curr = lastOfPair;
    }

    curr = curr.move(direction);
  }

  // Move items
  if (itemsToMove.length > 0) {
    const set = [...new Set(itemsToMove.map((p) => p.toKey()))].map((key) => Point.fromKey(key));
    set.reverse().forEach((item) => {
      const next = item.move(direction);
      map.set(next, map.get(item));
      map.set(item, EMPTY);
    });

    map.set(robot, EMPTY);
  }
}

// ---- Part A ----
export function partA({ map, moves }: Input): number {
  moves.forEach((move) => moveRobot(map, move));
  return getGPSCoordinates(map, SMALL_BOX);
}

// ---- Part B ----
function expandMap(map: Map2D<string>): Map2D<string> {
  const input = map.input;

  const newInput = Array(input.length)
    .fill(EMPTY)
    .map(() => Array(input[0].length * 2).fill(EMPTY));

  map.forEach(({ x, y }, value) => {
    switch (value) {
      case WALL:
      case EMPTY:
        newInput[x][y * 2] = value;
        newInput[x][y * 2 + 1] = value;
        break;
      case ROBOT:
        newInput[x][y * 2] = value;
        newInput[x][y * 2 + 1] = EMPTY;
        break;
      case SMALL_BOX:
        newInput[x][y * 2] = BOX_LEFT;
        newInput[x][y * 2 + 1] = BOX_RIGHT;
        break;
    }
  });

  return new Map2D(newInput);
}

export function partB({ map, moves }: Input): number {
  const expanded = expandMap(map);

  moves.forEach((move) => moveRobot(expanded, move));
  return getGPSCoordinates(expanded, BOX_LEFT);
}
