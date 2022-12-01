import path from 'path';
import { sum } from 'ramda';
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

// const DAYS = 80;
const DAYS = 256;

// ---- Part A ----
function partA(input: Input) {
  let fishes = input;
  let fishesAtDay = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  fishes.map((f) => {
    fishesAtDay[f] = fishesAtDay[f] + 1;
  });

  for (let i = 0; i < DAYS; i++) {
    let fishesToAdd = 0;
    for (let day = 0; day <= 8; day++) {
      const fishes = fishesAtDay[day];
      if (day !== 0) {
        fishesAtDay[day - 1] += fishes;
        fishesAtDay[day] = 0;
      } else {
        fishesToAdd = fishes;
        fishesAtDay[0] = 0;
      }
    }
    fishesAtDay[6] += fishesToAdd;
    fishesAtDay[8] = fishesToAdd;
  }

  return sum(fishesAtDay);
}

// ---- Part B ----
function partB(input: Input) {
  return 0;
}

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
