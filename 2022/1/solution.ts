import path from 'path';
import R from 'ramda';
import { findMax } from '../../utils/arrays';
import { toI } from '../../utils/numbers';
import { readFileRaw } from '../../utils/readFile';
import { timeAndPrint } from '../../utils/timeAndPrint';

// const inputFile = path.resolve(__dirname) + '/demo_input';
const inputFile = path.resolve(__dirname) + '/input';

type InputLine = string;
type Input = InputLine[];

// Input Data
let inputData: Input = readFileRaw(inputFile).split('\n');

const caloriesPerElf = (input: Input) => R.splitWhenever(R.equals(NaN), input.map(toI)).map(R.sum);

// ---- Part A ----
function partA(input: Input) {
  return findMax(caloriesPerElf(input));
}

// ---- Part B ----
function partB(input: Input) {
  return R.sum(caloriesPerElf(input).slice(0, 3));
}

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
