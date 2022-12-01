import path from 'path';
import R from 'ramda';
import { findMax, sortNums } from '../../utils/arrays';
import { toI } from '../../utils/numbers';
import { readFileRaw } from '../../utils/readFile';
import { timeAndPrint } from '../../utils/timeAndPrint';

const DEMO = true;

type InputLine = string;
type Input = InputLine[];

const caloriesPerElf = (input: Input) => R.splitWhenever(R.equals(NaN), input.map(toI)).map(R.sum);

// ---- Part A ----
function partA(input: Input) {
  return findMax(caloriesPerElf(input));
}

// ---- Part B ----
function partB(input: Input) {
  return R.sum(sortNums(caloriesPerElf(input), true).slice(0, 3));
}

const INPUT_DEMO = path.resolve(__dirname) + '/demo_input';
const INPUT_REAL = path.resolve(__dirname) + '/input';

// Input Data
let inputData: Input = readFileRaw(DEMO ? INPUT_DEMO : INPUT_REAL).split('\n');

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
