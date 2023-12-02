import R from 'ramda';
import { readFile } from '~utils/core';

type Input = string[];

type RgbArray = [number, number, number];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile);
}

const findValue = (regex: RegExp, line: string) => Number(regex.exec(line)?.[1] ?? 0);

export const findMaxPerTurn = (game: string): RgbArray =>
  game
    .split(':')[1]
    .split(';')
    .reduce(
      (max, round) => [
        Math.max(max[0], findValue(/(\d+) red/g, round)),
        Math.max(max[1], findValue(/(\d+) green/g, round)),
        Math.max(max[2], findValue(/(\d+) blue/g, round)),
      ],
      [0, 0, 0]
    );

// ---- Part A ----
export function partA(games: Input): number {
  const GAME_LIMITS: RgbArray = [12, 13, 14];

  return games.reduce((result, gameInput, i) => {
    const hasFailure = findMaxPerTurn(gameInput).some(
      (gameColor, colorIndex) => gameColor > GAME_LIMITS[colorIndex]
    );
    return hasFailure ? result : result + i + 1;
  }, 0);
}

// ---- Part B ----
export function partB(games: Input): number {
  return games.reduce((power, game) => power + R.product(findMaxPerTurn(game)), 0);
}
