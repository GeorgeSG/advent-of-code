import { SortDirection } from './types';

export const toI = (i) => parseInt(i);

export const numberCompare =
  (direction: SortDirection = SortDirection.ASC) =>
  (a: number, b: number) => {
    if (a === b) return 0;

    const multiplier = direction === SortDirection.ASC ? 1 : -1;
    return a < b ? multiplier * -1 : multiplier * 1;
  };
