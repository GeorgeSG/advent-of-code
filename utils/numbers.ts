import { SortDirection } from './types';

export const toI = (i) => parseInt(i);

export const numberCompare =
  (direction: SortDirection = SortDirection.ASC) =>
  (a: number, b: number) =>
    direction === SortDirection.ASC ? Math.sign(a - b) : Math.sign(b - a);
