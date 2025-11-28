import { endsWith, splitEvery, splitWhenever } from 'ramda';
import { findMin } from '~utils/arrays';
import { readFile } from '~utils/core';

type Map = [number, number, number];
type NamedMaps = Record<string, Map[]>;

type Input = {
  seeds: number[];
  maps: NamedMaps;
};

// Parser
export function prepareInput(inputFile: string): Input {
  const toNumArray = (str: string) => str.split(' ').map(Number);

  const inputLines = readFile(inputFile);
  const seeds = toNumArray(inputLines[0].split(': ')[1]);

  const mapInput = inputLines.slice(1);
  const mapNames = mapInput.filter(endsWith('map:'));
  const mapValues = splitWhenever(endsWith('map:'), mapInput).map((mapLine) =>
    mapLine.map(toNumArray)
  );
  const maps = Object.assign({}, ...mapNames.map((name, i) => ({ [name]: mapValues[i] })));

  return { seeds, maps };
}

// ---- Part A ----
export function partA({ seeds, maps }: Input): number {
  function findDestination(location: number, mapName: string): number {
    const viableMap = maps[mapName].find(
      ([_, sourceStart, range]) => location >= sourceStart && location < sourceStart + range
    );
    return viableMap ? viableMap[0] + (location - viableMap[1]) : location;
  }

  const mapNames = Object.keys(maps);
  const locations = seeds.map((seed) => mapNames.reduce(findDestination, seed));
  return findMin(locations);
}

export function partB({ seeds, maps }: Input): number {
  console.warn(
    'WARN: Part B · this is a brute-force solution and takes minutes (~ 100 secs on my machine) 🙃\n'
  );

  const mapOrder = Object.keys(maps).reverse();
  const splitSeeds = splitEvery(2, seeds);

  function isSeed(location: number) {
    return splitSeeds.some(([start, range]) => location >= start && location <= start + range);
  }

  function findSource(location: number, mapName: string): number {
    const viableMap = maps[mapName].find(
      ([destinationStart, _, range]) =>
        location >= destinationStart && location < destinationStart + range
    );

    return viableMap ? viableMap[1] + (location - viableMap[0]) : location;
  }

  function isViableLocation(location: number) {
    const potentialSeed = mapOrder.reduce(findSource, location);
    return isSeed(potentialSeed);
  }

  let minLocation = 1;

  while (true) {
    if (minLocation % 1_000_000 === 0) console.log(`Searching: ${minLocation}`);

    if (isViableLocation(minLocation)) {
      return minLocation;
    }

    minLocation++;
  }
}
