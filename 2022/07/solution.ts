import R from 'ramda';
import { findMin } from '~utils/arrays';
import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';
import { NumericMap } from '~utils/numericMap';

type FolderSizes = Record<string, number>;

function cd(currentPath: string, cdArg: string): string {
  switch (cdArg) {
    case '/':
      return '/';
    case '..':
      return currentPath.slice(0, R.findLastIndex(R.equals('/'), currentPath.split('')));
    default:
      return `${currentPath}${currentPath === '/' ? '' : '/'}${cdArg}`;
  }
}

const notDir = (file: string) => !file.startsWith('dir');
const fileSize = (file: string) => toI(file.split(' ')[0]);
const computeFileSize = (files: string[]) => R.sum(files.filter(notDir).map(fileSize));

// Parser
export function prepareInput(inputFile: string): FolderSizes {
  let remaining: string[] = readFile(inputFile);

  const folderSizes = new NumericMap<string>();
  let currentPath = '/';

  while (remaining.length) {
    const cmnd = remaining[0];
    remaining = remaining.slice(1);

    if (cmnd.startsWith('$ cd')) {
      currentPath = cd(currentPath, cmnd.split('$ cd ')[1]);
      continue;
    }

    // this is certain in the inputs, but feels weird to assume :D
    if (cmnd.startsWith('$ ls')) {
      const nextCmdIndex = remaining.findIndex((line) => line.startsWith('$'));

      const lsOutput = nextCmdIndex > -1 ? remaining.slice(0, nextCmdIndex) : remaining;
      folderSizes.set(currentPath, computeFileSize(lsOutput));

      remaining = nextCmdIndex > -1 ? remaining.slice(nextCmdIndex) : [];
    }
  }

  // adjust parent sizes based on children
  folderSizes
    .keys()
    .slice(1) // ignore root
    .forEach((path) => {
      const segments = path.split('/').slice(1, -1); // all parent names, excl current folder name
      const parentPaths = segments.map((_, i) => `/${R.take(i + 1, segments).join('/')}`); // map parent names to parent paths
      ['/', ...parentPaths].forEach((parent) => folderSizes.inc(parent, folderSizes.get(path)));
    });

  return folderSizes.raw();
}

// ---- Part A ----
export function partA(input: FolderSizes): number {
  return R.sum(Object.values(input).filter((folderSize) => folderSize <= 100000));
}

// ---- Part B ----
export function partB(input: FolderSizes): number {
  const TOTAL_DISK = 70_000_000;
  const MIN_REQUIRED = 30_000_000;
  const USED_DISK = input['/'];
  const SPACE_NEEDED = MIN_REQUIRED - (TOTAL_DISK - USED_DISK);

  return findMin(Object.values(input).filter((folderSize) => folderSize >= SPACE_NEEDED));
}
