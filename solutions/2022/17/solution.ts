import R from 'ramda';
import { findMax } from '~utils/arrays';
import { readFile } from '~utils/core';

type Input = string;
type Board = string[];
type Tetromino = string[];

const ROW = ['@@@@'];

// prettier-ignore
const PLUS = [
  '.@.',
  '@@@',
  '.@.'
];

// prettier-ignore
const L = [
  '@@@',
  '..@',
  '..@'
];

// prettier-ignore
const COL = [
  '@',
  '@',
  '@',
  '@'];

// prettier-ignore
const SQ = [
  '@@',
  '@@'
];

const EMPTY_LINE = '.......';

const tetrominoes: Tetromino[] = [ROW, PLUS, L, COL, SQ];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile)[0];
}

let currentDir = 0;
let board: Board = [];

const print = (name) => {
  console.log(`\n${name}`);
  board
    .slice()
    .reverse()
    .forEach((i) => console.log(i));
  console.log('');
};

const toSpace = (range: number[]) => range.map((_) => '.').join('');
function tetrominoAtPos(
  tetromino: Tetromino,
  position: number
): { inBoard: Tetromino; pos: number } {
  const tetroWidth = findMax(tetromino.map((l) => l.length));

  const paddingLeft = Math.min(position, 7 - tetroWidth);

  const prefix = toSpace(R.range(0, paddingLeft));
  return {
    inBoard: tetromino.map((line) => {
      let line2 = `${prefix}${line}`;
      const suffix = toSpace(R.range(0, 7 - line2.length));
      return `${line2}${suffix}`;
    }),
    pos: paddingLeft,
  };
}

function canFall(): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i].charAt(j) === '@') {
        if (i === 0 || board[i - 1].charAt(j) === '#') {
          return false;
        }
      }
    }
  }
  return true;
}

function canMove(direction: number): boolean {
  return !board.find((line) => {
    for (let i = 0; i < line.length; i++) {
      if (line.charAt(i) !== '@') {
        continue;
      }

      if (i === 0 && direction === -1) return true;
      if (i === line.length - 1 && direction === 1) return true;
      if (line.charAt(i + direction) === '#') return true;
    }
  });
}

function move(directions: Input) {
  const direction = directions[currentDir % directions.length] === '>' ? 1 : -1;
  if (canMove(direction)) {
    board = board.map((line) => {
      if (!line.includes('@')) {
        return line;
      }

      const tempLine = line.slice().split('');
      if (direction === -1) {
        for (let i = 0; i < line.length; i++) {
          if (line.charAt(i + 1) === '@') {
            tempLine[i] = '@';
          } else if (line.charAt(i) === '@') {
            tempLine[i] = '.';
          }
        }
      } else {
        for (let i = line.length - 1; i >= 0; i--) {
          if (line.charAt(i - 1) === '@') {
            tempLine[i] = '@';
          } else if (line.charAt(i) === '@') {
            tempLine[i] = '.';
          }
        }
      }

      return tempLine.join('');
    });
  }

  currentDir += 1;
}

function simulateFall2(tetromino: Tetromino, directions: Input) {
  board = board.concat([EMPTY_LINE, EMPTY_LINE, EMPTY_LINE]);

  let falling = tetrominoAtPos(tetromino.slice(), 2).inBoard;
  board = board.concat(falling);

  while (true) {
    move(directions);
    if (!canFall()) {
      break;
    }

    let newBoard = board.slice().map((line) => line.replaceAll('@', '.').split(''));

    for (let i = 1; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i].charAt(j) === '@') {
          newBoard[i - 1][j] = '@';
        }
      }
    }
    board = newBoard.map((line) => line.join(''));

    if (!board[board.length - 1].includes('#') && !board[board.length - 1].includes('@')) {
      board.pop();
    } else {
      board[board.length - 1] = board[board.length - 1].replaceAll('@', '.');
    }
  }

  // solidify
  board = board.map((line) => line.replaceAll('@', '#'));
}

// ---- Part A ----
export function partA(input: Input): number {
  let fallen = 0;
  while (fallen < 2022) {
    simulateFall2(tetrominoes[fallen % tetrominoes.length], input);

    fallen += 1;
  }

  return board.length;
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
