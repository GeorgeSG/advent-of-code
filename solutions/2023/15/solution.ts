import { sum } from 'ramda';
import { readFile } from '~utils/core';

type Input = string[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => line.split(','))[0];
}

function hash(str: string): number {
  return str.split('').reduce((hash, char) => ((hash + char.charCodeAt(0)) * 17) % 256, 0);
}

// ---- Part A ----
export function partA(input: Input): number {
  return sum(input.map(hash));
}

// ---- Part B ----
export function partB(input: Input): number {
  const boxes = new Map<number, { lens: string; focalLength: number }[]>();

  input.forEach((step) => {
    let label;
    let op;
    let focalLength;
    if (step.includes('=')) {
      label = step.split('=')[0];
      op = '=';
      focalLength = Number(step.split('=')[1]);
    } else {
      label = step.split('-')[0];
      op = '-';
    }
    const box = hash(label);
    const boxContents = boxes.get(box);
    const indexInBox = boxContents?.findIndex(({ lens }) => lens === label);
    if (op === '-') {
      if (indexInBox > -1) {
        boxContents.splice(indexInBox, 1);
      }
    } else {
      if (indexInBox > -1) {
        boxContents[indexInBox].focalLength = focalLength;
      } else {
        boxes.set(box, [...(boxContents || []), { lens: label, focalLength }]);
      }
    }
  });

  return sum(
    [...boxes.entries()].map(([box, contents]) =>
      contents.reduce((acc, { focalLength }, pos) => acc + (box + 1) * (pos + 1) * focalLength, 0)
    )
  );
}
