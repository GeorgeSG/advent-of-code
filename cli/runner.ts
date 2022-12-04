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

const DATA_MISSING = '-';
type DATA_MISSING = typeof DATA_MISSING;

const cmndArgs = process.argv.slice(2);
const folderArg = cmndArgs.length >= 1 ? cmndArgs[0] : null;
const typeArg = cmndArgs.length >= 2 ? cmndArgs[1] : 'both';

const table = new Table({
  title: bold().white(`${folderArg} Results`),
  disabledColumns: ['_output'],
  charLength: { '❌': 2, '✅': 2 },
  columns: [
    { name: 'part', title: 'Part', alignment: 'left', color: 'white' },
    { name: 'time', title: 'Time', alignment: 'left', color: 'white' },
    { name: 'type', title: 'Type', alignment: 'left' },
    { name: 'expected', title: 'Expected' },
  ],
  computedColumns: [
    {
      name: 'Output',
      function(row) {
        if (row.expected === DATA_MISSING) {
          return bold().yellow(row._output);
        }
        return row._output === row.expected ? bold().green(row._output) : bold().red(row._output);
      },
    },
    {
      name: 'Result',
      function(row) {
        if (row.expected === DATA_MISSING) {
          return DATA_MISSING;
        }
        return row._output === row.expected ? '✅' : '❌';
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
  // Check that solution exists and get handlers
  const { solutionFn, prepareInput } = loadSolution(folder, part);

  // Get input and output
  const { inputFile, outputFile } = getFilePaths(folder, run);
  if (!existsSync(inputFile)) {
    warning(
      `'${R.last(inputFile.split('/'))}' file does not exist! Skipping ${run.toLowerCase()} tests!`
    );
    return;
  }
  const expected = existsSync(outputFile) ? getExpectedResult(outputFile, part) : '-';

  // Run input through solution code and measure time
  const start = process.hrtime();
  const result = solutionFn(prepareInput(inputFile));
  const end = hrtime(start);
  const timeInMs = (end[0] * 1000000000 + end[1]) / 1000000;

  let time: any = timeInMs > 1000 ? timeInMs / 1000 : timeInMs;
  time = `${time.toPrecision(6).slice(0, 6)} ${timeInMs > 1000 ? 's' : 'ms'}`;

  // Add to results table
  table.addRow({
    _output: result,
    part: `Part ${part.toUpperCase()}`,
    type: run === Run.EXAMPLE ? bold().cyan(run) : bold().magenta(run),
    time,
    expected,
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

function getExpectedResult(outputFile: string, part: Part): number | DATA_MISSING {
  const resultIndex = part === Part.A ? 0 : 1;
  const definedResults = readFileRaw(outputFile)
    .split('\n')
    .map(toI)
    .filter((n) => !isNaN(n));

  return definedResults.length >= resultIndex + 1 ? definedResults[resultIndex] : DATA_MISSING;
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
