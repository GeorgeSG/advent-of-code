import R from 'ramda';
import { readFile } from '~utils/core';

type Input = string[];

type RgbArray = [number, number, number];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile);
}

const findValue = (regex: RegExp, line: string) => Number(regex.exec(line)?.[1] ?? 0);

export const findMaxPerTurn = (game: string) =>
  game
    .split(':')[1]
    .split(';')
    .reduce(
      (max, round) => {
        max[0] = Math.max(max[0], findValue(/(\d+) red/g, round));
        max[1] = Math.max(max[1], findValue(/(\d+) green/g, round));
        max[2] = Math.max(max[2], findValue(/(\d+) blue/g, round));
        return max;
      },
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
