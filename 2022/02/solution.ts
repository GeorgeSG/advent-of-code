import { readFile } from '~utils/core';

type Input = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'][];

export const POINTS_PER_PLAYED = { X: 1, Y: 2, Z: 3 };

export const WIN = { A: 'Y', B: 'Z', C: 'X' };
export const DRAW = { A: 'X', B: 'Y', C: 'Z' };
export const LOSE = { A: 'Z', B: 'X', C: 'Y' };

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(' '));
}

function scoreGame(player1, player2): number {
  const score = WIN[player1] === player2 ? 6 : DRAW[player1] === player2 ? 3 : 0;
  return POINTS_PER_PLAYED[player2] + score;
}

// ---- Part A ----
export function partA(input: Input) {
  return input.reduce((score, game) => score + scoreGame(...game), 0);
}

// ---- Part B ----
export function partB(input: Input) {
  return input.reduce((score, game) => {
    const player1 = game[0];

    const MOVE = game[1] === 'X' ? LOSE : game[1] === 'Y' ? DRAW : WIN;
    const player2 = MOVE[player1];

    return score + scoreGame(player1, player2);
  }, 0);
}
