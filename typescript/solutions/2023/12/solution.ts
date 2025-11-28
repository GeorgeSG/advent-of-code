import { sum } from 'ramda';
import { readFile } from '~utils/core';

type Spring = {
  status: string;
  groups: number[];
};
type Input = Spring[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => {
    const [status, groups] = line.split(' ');
    return { status, groups: groups.split(',').map(Number) };
  });
}

const cache: Map<string, number> = new Map();
function setCache(key, value: number): number {
  cache.set(key, value);
  return value;
}

const count = ({ status, groups }: Spring): number => {
  const cacheKey = `${status}${groups.join('')}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (status.length === 0) {
    return groups.length === 0 ? 1 : 0;
  }

  if (groups.length === 0) {
    return status.includes('#') ? 0 : 1;
  }

  if (status.length < sum(groups) + groups.length - 1) {
    return 0;
  }

  const dropFirst = status.slice(1);

  switch (status.charAt(0)) {
    case '.':
      return setCache(cacheKey, count({ status: dropFirst, groups }));
    case '#': {
      const [group, ...remainingGroups] = groups;
      // if there are more # than needed, or the curent ### group is not long enough, invalid
      if (status[group] === '#' || status.slice(0, group).includes('.')) {
        return 0;
      }

      return count({ status: status.slice(group + 1), groups: remainingGroups });
    }
    case '?':
      return (
        count({ status: `#${dropFirst}`, groups }) + count({ status: `.${dropFirst}`, groups })
      );
  }
};

// ---- Part A ----
export function partA(input: Input): number {
  return sum(input.map(count));
}

// ---- Part B ----
export function partB(input: Input): number {
  const newInput = input.map(({ status, groups }) => ({
    status: `${status}?${status}?${status}?${status}?${status}`,
    groups: [...groups, ...groups, ...groups, ...groups, ...groups],
  }));
  return partA(newInput);
}
