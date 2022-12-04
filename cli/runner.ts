import appRootPath from 'app-root-path';
import { Table } from 'console-table-printer';
import { existsSync } from 'fs';
import { bold } from 'kleur';
import { hrtime } from 'process';
import R from 'ramda';
import { readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';

enum Part {
  A = 'a',
  B = 'B',
}

enum Run {
  EXAMPLE = 'example',
  REAL = 'real',
}

const cmndArgs = process.argv.slice(2);
const folderArg = cmndArgs.length >= 1 ? cmndArgs[0] : null;
const typeArg = cmndArgs.length >= 2 ? cmndArgs[1] : 'both';

const table = new Table({
  title: bold().white(`${folderArg} Results`),
  disabledColumns: ['_output', '_result'],
  charLength: { '❌': 2, '✅': 2 },
  columns: [
    { name: 'Run', alignment: 'left', color: 'white' },
    { name: 'Time', alignment: 'left', color: 'white' },
    { name: 'Type', alignment: 'left' },
    { name: 'Expected' },
  ],
  computedColumns: [
    {
      name: 'Output',
      function: (row) => {
        if (row.Expected === '-') {
          return bold().yellow(row._output);
        }
        return row._output === row.Expected ? bold().green(row._output) : bold().red(row._output);
      },
    },
    {
      name: 'Result',
      function: (row) => {
        if (row.Expected === '-') {
          return '-';
        }
        return row._output === row.Expected ? '✅' : '❌';
      },
    },
  ],
});

if (folderArg) {
  if (typeArg === 'a' || typeArg === 'b') {
    run(folderArg, typeArg as Part, Run.EXAMPLE);
    run(folderArg, typeArg as Part, Run.REAL);
  }

  if (typeArg === 'example' || typeArg === 'both') {
    run(folderArg, Part.A, Run.EXAMPLE);
    run(folderArg, Part.B, Run.EXAMPLE);
  }

  if (typeArg === 'real' || typeArg === 'both') {
    run(folderArg, Part.A, Run.REAL);
    run(folderArg, Part.B, Run.REAL);
  }

  table.printTable();
}

function run(folder: string, part: Part, run: Run) {
  const { solutionFn, prepareInput } = loadSolution(folder, part);
  const { inputFile, outputFile } = getFilePaths(folder, run);

  if (!existsSync(inputFile)) {
    warning(
      `'${R.last(inputFile.split('/'))}' file does not exist! Skipping ${run.toLowerCase()} tests!`
    );
    return;
  }

  const input = prepareInput(inputFile);
  const expectedOutput = existsSync(outputFile) ? getExpectedResult(outputFile, part) : '-';

  const runType = run === Run.EXAMPLE ? bold().cyan(run) : bold().magenta(run);
  const runPartLabel = `Part ${part}`;

  const start = hrtime()[1];
  const result = solutionFn(input);
  const end = hrtime()[1];
  const time = `${((end - start) / 1000000).toPrecision(6).slice(0, 5)} ms`;

  table.addRow({
    Run: runPartLabel,
    Type: runType,
    _output: result,
    Time: time,
    Expected: expectedOutput !== '-' && isNaN(expectedOutput) ? '-' : expectedOutput,
  });
}

// -------- Helpers

function getFilePaths(folder: string, run: Run) {
  const path = `${appRootPath}/${folder}`;

  const testInputFile = `${path}/test_input`;
  const testOutputFile = `${path}/test_output`;
  const realInputFile = `${path}/input`;
  const realOutputFile = `${path}/real_output`;

  return {
    inputFile: run === Run.REAL ? realInputFile : testInputFile,
    outputFile: run === Run.REAL ? realOutputFile : testOutputFile,
  };
}

function loadSolution(folder: string, part: Part) {
  const solutionFile = `${appRootPath}/${folder}/solution.ts`;

  if (!existsSync(solutionFile)) {
    error('Solution file does not exist!', true);
  }

  const { partA, partB, prepareInput } = require(solutionFile);

  if (part === Part.A && typeof partA !== 'function') {
    error('`partA` function not found', true);
  }

  if (part === Part.B && typeof partB !== 'function') {
    error('`partB` function not found', true);
  }

  if (typeof prepareInput !== 'function') {
    error('`prepareInput` function not found', true);
  }

  const solutionFn = part === Part.A ? partA : partB;

  return { solutionFn, prepareInput };
}

function getExpectedResult(outputFile: string, part: Part): number {
  return readFileRaw(outputFile).split('\n').map(toI)[part === Part.A ? 0 : 1];
}

function error(message: string, exit: boolean = false) {
  console.log(bold().red(`ERROR: ${message}!`));

  if (exit) {
    process.exit();
  }
}

function warning(message: string) {
  console.log(bold().yellow(`WARNING: ${message}`));
}
