import { product, sum } from 'ramda';
import { readFile } from '~utils/core';
import { Map2D } from '~utils/map2d';
import { Point2D } from '~utils/points';

type Input = string[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile);
}

const allIndexesOf = (str: string, char: string) =>
  str
    .split('')
    .reduce<number[]>((indexes, current, i) => (current === char ? [...indexes, i] : indexes), []);

const matchAllNumbers = (str: string) => str.matchAll(/(\d+)/g);

const toNumber = (match: RegExpMatchArray) => Number(match[0]);

const findNumbersBy = (str, filterFn: (match: RegExpMatchArray) => boolean) =>
  [...matchAllNumbers(str)].filter(filterFn).map(toNumber);

// ---- Part A ----
export function partA(input: Input): number {
  const map = Map2D.fromLines<string>(input.map((line) => [...line]));

  const isSymbol = (point: Point2D) => !/[0-9.]/.test(map.get(point));

  const isPart = (match: RegExpMatchArray, lineIndex: number) =>
    [...match[0]].some((_, i) =>
      map.findAdjacentAll({ x: lineIndex, y: match.index + i }).some(isSymbol)
    );

  const partNumbersOnLine = (line: string, lineIndex: number) =>
    findNumbersBy(line, (match) => isPart(match, lineIndex));

  return sum(input.flatMap(partNumbersOnLine));
}

// ---- Part B ----
export function partB(input: Input): number {
  const GEAR = '*';

  const adjacentPartsOnLine = (gearIndex: number, line: string) =>
    findNumbersBy(
      line,
      (match) => match.index - 1 <= gearIndex && match.index + match[0].length >= gearIndex
    );

  const gearRatiosOnLine = (line: string, lineIndex: number) =>
    allIndexesOf(line, GEAR).map((gearIndex) => {
      const adjacentParts = [-1, 0, 1].flatMap((lineOffset) =>
        adjacentPartsOnLine(gearIndex, input[lineIndex + lineOffset])
      );

      return adjacentParts.length === 2 ? product(adjacentParts) : 0;
    });

  return sum(input.flatMap(gearRatiosOnLine));
}
