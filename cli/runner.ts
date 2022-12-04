import appRootPath from 'app-root-path';
import { Table } from 'console-table-printer';
import { existsSync } from 'fs';
import { bold } from 'kleur';
import { hrtime } from 'process';
import { readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';

const cmndArgs = process.argv.slice(2);
const folderArg = cmndArgs.length >= 1 ? cmndArgs[0] : null;
const typeArg = cmndArgs.length >= 2 ? cmndArgs[1] : 'both';

const p = new Table({
  title: bold().white(`${folderArg} Results`),
  disabledColumns: ['_output', '_result'],
  charLength: { '❌': 2, '✅': 2 },
  columns: [
    { name: 'Run', alignment: 'left', color: 'white' }, // column coloring
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
    runExample(folderArg, typeArg);
    runReal(folderArg, typeArg);
  }

  if (typeArg === 'example' || typeArg === 'both') {
    runExample(folderArg, 'a');
    runExample(folderArg, 'b');
  }

  if (typeArg === 'real' || typeArg === 'both') {
    runReal(folderArg, 'a');
    runReal(folderArg, 'b');
  }

  p.printTable();
}

function runExample(folder: string, part: 'a' | 'b') {
  const { partA, partB, prepareInput } = loadSolution(folder);
  const { testOutputFile, testInputFile } = getFilePaths(folder);

  if (!existsSync(testOutputFile) || !existsSync(testInputFile)) {
    console.log(bold().yellow('WARNING: Test files do not exist! Skipping tests...'));
    return;
  }

  const input = prepareInput(testInputFile);
  const expectedResult = getExpectedResult(testOutputFile, part);

  const runFn = part === 'a' ? partA : partB;
  run(`${folder} ${part.toUpperCase()}`, () => runFn(input), 'Example', expectedResult);
}

function runReal(folder: string, part: 'a' | 'b') {
  const { partA, partB, prepareInput } = loadSolution(folder);
  const { inputFile, realOutputFile } = getFilePaths(folder);

  if (!existsSync(inputFile)) {
    console.log(bold().yellow('WARNING: Input does not exist! Skipping prod...'));
    return;
  }

  let expected;
  if (existsSync(realOutputFile)) {
    expected = getExpectedResult(realOutputFile, part);
  }

  const input = prepareInput(inputFile);
  const runFn = part === 'a' ? partA : partB;
  run(`${folder} ${part.toUpperCase()}`, () => runFn(input), 'Real', expected);
}

// -------- Helpers

function getFilePaths(folder: string) {
  const path = `${appRootPath}/${folder}`;

  return {
    solutionFile: `${path}/solution.ts`,
    testInputFile: `${path}/test_input`,
    testOutputFile: `${path}/test_output`,
    inputFile: `${path}/input`,
    realOutputFile: `${path}/real_output`,
  };
}

function loadSolution(folder: string) {
  const { solutionFile } = getFilePaths(folder);

  if (!existsSync(solutionFile)) {
    console.log(bold().red('ERROR: Solution file does not exist!'));
    process.exit();
  }

  const { partA, partB, prepareInput } = require(solutionFile);

  if (typeof partA !== 'function') {
    console.log(bold().red('ERROR: partA not a function'));
    process.exit();
  }

  if (typeof partB !== 'function') {
    console.log(bold().red('ERROR: partB not a function'));
    process.exit();
  }

  if (typeof prepareInput !== 'function') {
    console.log(bold().red('ERROR: prepareInput not a function'));
    process.exit();
  }

  return { partA, partB, prepareInput };
}

function run(name: string, runFn: () => number, type: 'Real' | 'Example', expected?: number) {
  const runType = type === 'Example' ? bold().cyan(type) : bold().magenta(type);
  const runPart = `Part ${name.split(' ')[1]}`;

  const start = hrtime()[1];
  const result = runFn();
  const end = hrtime()[1];
  const time = `${((end - start) / 1000000).toPrecision(6).slice(0, 5)} ms`;
  const commonTableData = { Run: runPart, Time: time, Type: runType, _output: result };

  if (expected) {
    const resultString = result !== expected ? 'fail' : 'success';
    p.addRow({
      ...commonTableData,
      Expected: expected,
      _result: resultString,
    });
  } else {
    p.addRow({
      ...commonTableData,
      Expected: '-',
      _result: '-',
    });
  }
}

function getExpectedResult(outputFile: string, part: 'a' | 'b'): number {
  return readFileRaw(outputFile).split('\n').map(toI)[part === 'a' ? 0 : 1];
}
