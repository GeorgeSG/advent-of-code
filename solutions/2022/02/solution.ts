import { readFile } from '~utils/core';

type Input = ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'][];

const POINTS_PER_PLAYED = { X: 1, Y: 2, Z: 3 };

const WIN = { A: 'Y', B: 'Z', C: 'X' };
const DRAW = { A: 'X', B: 'Y', C: 'Z' };
const LOSE = { A: 'Z', B: 'X', C: 'Y' };

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(' ')) as Input;
}

function scoreGame(player1, player2): number {
  const score = WIN[player1] === player2 ? 6 : DRAW[player1] === player2 ? 3 : 0;
  return POINTS_PER_PLAYED[player2] + score;
}

// ---- Part A ----
export function partA(input: Input): number {
  return input.reduce((score, game) => score + scoreGame(...game), 0);
}

// ---- Part B ----
export function partB(input: Input): number {
  return input.reduce((score, [player1, roundEnd]) => {
    const MOVE = roundEnd === 'X' ? LOSE : roundEnd === 'Y' ? DRAW : WIN;
    const player2 = MOVE[player1];

    return score + scoreGame(player1, player2);
  }, 0);
}
