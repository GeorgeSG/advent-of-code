import path from 'path';
import { readFile, timeAndPrint } from '~utils/core';

const DEMO = true;

type InputLine = string;
type Input = InputLine[];

// Parser
const lineParser = (line: string): InputLine => line;

// ---- Part A ----
function partA(input: Input) {
  return 0;
}

// ---- Part B ----
function partB(input: Input) {
  return 0;
}

const INPUT_DEMO = path.resolve(__dirname) + '/demo_input';
const INPUT_REAL = path.resolve(__dirname) + '/input';

// Input Data
const INPUT_DATA: Input = readFile(DEMO ? INPUT_DEMO : INPUT_REAL, lineParser);

timeAndPrint(
  () => partA(INPUT_DATA),
  () => partB(INPUT_DATA)
);
