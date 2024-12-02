import { readFile } from '~utils/core';

type Input = number[][];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(' ').map(Number));
}

function hasLevelFailure(a: number, b: number, decreasing: boolean): boolean {
  return a === b || Math.abs(a - b) > 3 || (decreasing && a < b) || (!decreasing && a > b);
}

function isSafe(report: number[]): boolean {
  const decreasing = report[0] > report[1];

  const failingLevel = report.find(
    (num, i) => i < report.length - 1 && hasLevelFailure(num, report[i + 1], decreasing)
  );

  return failingLevel === undefined;
}

function withDampener(report: number[]): number[][] {
  return report.reduce((acc, _, i) => {
    acc.push([...report.slice(0, i), ...report.slice(i + 1)]);
    return acc;
  }, []);
}

function isDampenedSafe(report: number[]) {
  return withDampener(report).some(isSafe);
}

// ---- Part A ----
export function partA(reports: Input): number {
  return reports.filter(isSafe).length;
}

// ---- Part B ----
export function partB(reports: Input): number {
  return reports.filter(isDampenedSafe).length;
}
