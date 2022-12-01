import { last, splitEvery, sum, transpose, without } from 'ramda';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Board = number[][];
type Input = {
  draw: number[];
  boards: Board[];
};

export function prepareInput(inputFile: string): Input {
  const inputRaw = readFile(inputFile);

  return {
    draw: inputRaw[0].split(',').map(toI),
    boards: splitEvery(
      5, // split into subarrays of each 5 rows
      inputRaw
        .slice(1) // drop draw
        .map((line) => line.trim().replaceAll('  ', ' ').split(' ').map(toI))
    ),
  };
}

function checkBingo(board: Board, draw: number[]) {
  if (board.some((row) => without(draw, row).length === 0)) {
    return true;
  }

  if (transpose(board).some((row) => without(draw, row).length === 0)) {
    return true;
  }

  return false;
}

function score(board: Board, draw: number[]) {
  return sum(without(draw, board.flat())) * last(draw);
}

export function partA({ boards, draw }: Input) {
  const currentDraw: number[] = [];

  for (let i = 0; i < draw.length; i++) {
    currentDraw.push(draw[i]);

    const bingoBoard = boards.find((board) => checkBingo(board, currentDraw));

    if (bingoBoard) {
      return score(bingoBoard, currentDraw);
    }
  }

  return 0;
}

export function partB({ boards, draw }: Input) {
  const currentDraw = [];
  let remainingBoards = boards;

  for (let i = 0; i < draw.length; i++) {
    currentDraw.push(draw[i]);

    remainingBoards = remainingBoards.filter((board) => !checkBingo(board, currentDraw));

    if (remainingBoards.length === 1) {
      const remainingBoard = remainingBoards[0];
      currentDraw.push(draw[i + 1]);
      return score(remainingBoard, currentDraw);
    }
  }

  return 0;
}
