import { readFile } from '~utils/core';
import { toI } from '~utils/numbers';

type Input = (number | null)[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => (line === 'noop' ? null : toI(line.split(' ')[1])));
}

// ---- Part A ----
export function partA(input: Input): number {
  let x = 1;
  let cycle = 0;

  const cycleOp = () => {
    cycle += 1;
    return (cycle - 20) % 40 === 0 ? x * cycle : 0; // add only on 20, 60, ... etc
  };

  return input.reduce((res, addx) => {
    res += cycleOp();

    if (addx) {
      res += cycleOp();
      x += addx;
    }

    return res;
  }, 0);
}

// ---- Part B ----
export function partB(input: Input): number {
  const ROW_LENGTH = 40;

  let spriteStart = 0;
  let cycle = 0;

  let display = '';

  const cycleOp = () => {
    const printPos = cycle % ROW_LENGTH;
    display += printPos >= spriteStart && printPos <= spriteStart + 2 ? '#' : '.';

    cycle += 1;
    if (cycle % ROW_LENGTH === 0) display += '\n';
  };

  input.forEach((addx) => {
    cycleOp();

    if (addx) {
      cycleOp();
      spriteStart += addx;
    }
  });

  console.log(display);
  return 0;
}
