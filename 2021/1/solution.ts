import path from 'path';
import { readFile } from '../../utils/readFile';
import { timeAndPrint } from '../../utils/timeAndPrint';

const inputFile = path.resolve(__dirname) + '/input';
let inputData = readFile(inputFile, parseInt);

function partA(input) {
  let result = 0;

  for (let i = 1; i < input.length - 1; i++) {
    if (input[i] > input[i - 1]) {
      result += 1;
    }
  }

  return result;
}

function partB(input) {
  let result = 0;
  let windows: number[] = [];

  for (let i = 0; i < input.length - 3; i++) {
    windows[i] = input[i] + input[i + 1] + input[i + 2];
    if (i > 0 && windows[i] > windows[i - 1]) {
      result++;
    }
  }

  return result;
}

timeAndPrint(
  () => partA(inputData),
  () => partB(inputData)
);
