import { SortDirection } from './types';

export const toI = (i) => parseInt(i);

export const numberCompare =
  (direction: SortDirection = SortDirection.ASC) =>
  (a: number, b: number) =>
    direction === SortDirection.ASC ? Math.sign(a - b) : Math.sign(b - a);

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function arrayLcm(numbers: number[]): number {
  return numbers.reduce(lcm);
}

export function wrapNumber(value: number, max: number): number {
  return ((value % max) + max) % max;
}
