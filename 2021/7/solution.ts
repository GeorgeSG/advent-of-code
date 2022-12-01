import path from 'path';
import R from 'ramda';
import { findMax, sortNums } from '../../utils/arrays';
import { toI } from '../../utils/numbers';
import { readFile } from '../../utils/readFile';
import { timeAndPrint } from '../../utils/timeAndPrint';

// const inputFile = path.resolve(__dirname) + '/demo_input';
const inputFile = path.resolve(__dirname) + '/input';

type InputLine = number[];
type Input = InputLine;

// Parser
const lineParser = (line: string): InputLine => line.split(',').map(toI);
// Input Data
let inputData: Input = readFile(inputFile, lineParser)[0];

// ---- Part A ----
function partA(input: Input) {
  const optimalPos = R.median(input);
  return R.sum(input.map((i) => Math.abs(optimalPos - i)));
}

// ---- Part B ----
function partB(input: Input) {
  const max = findMax(input);

  let minFuel = Number.POSITIVE_INFINITY;

  // this will take a while xD. ~12secs
  for (let pos = 0; pos < max; pos++) {
    const fuelPerSub = input.map((i) => {
      const change = Math.abs(pos - i);
      return R.sum(R.range(1, change + 1));
    });

    const fuel = R.sum(fuelPerSub);
    if (minFuel > fuel) {
      minFuel = fuel;
    }
  }

  return minFuel;
}

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
