import appRootPath from 'app-root-path';
import { existsSync } from 'fs';
import { bold, green, red, yellow } from 'kleur';
import { readFileRaw } from '~utils/core';
import { toI } from '~utils/numbers';

const cmndArgs = process.argv.slice(2);
const folderArg = cmndArgs.length >= 1 ? cmndArgs[0] : null;
const typeArg = cmndArgs.length >= 2 ? cmndArgs[1] : 'both';

if (folderArg) {
  if (typeArg === 'a') {
    header('Part A: Example');
    runExample(folderArg, 'a');
    console.log();

    header('Part A: Real');
    runReal(folderArg, 'a');
    console.log();
  }

  if (typeArg === 'b') {
    header('Part B: Example');
    runExample(folderArg, 'b');
    console.log();

    header('Part B: Real');
    runReal(folderArg, 'b');
    console.log();
  }

  if (typeArg === 'example' || typeArg === 'both') {
    header('Part A: Example');
    runExample(folderArg, 'a');
    console.log();

    header('Part B: Example');
    runExample(folderArg, 'b');
    console.log();
  }

  if (typeArg === 'real' || typeArg === 'both') {
    header('Part A: Real');
    runReal(folderArg, 'a');
    console.log();

    header('Part B: Real');
    runReal(folderArg, 'b');
    console.log();
  }
}

function runExample(folder: string, part: 'a' | 'b') {
  const { partA, partB, prepareInput } = loadSolution(folder);
  const { testOutputFile, testInputFile } = getFilePaths(folder);

  if (!existsSync(testOutputFile) || !existsSync(testInputFile)) {
    console.log(yellow().bold('WARNING: Test files do not exist! Skipping tests...'));
    return;
  }

  const expectedA = readFileRaw(testOutputFile).split('\n').map(toI)[part === 'a' ? 0 : 1];
  const input = prepareInput(testInputFile);
  const fn = part === 'a' ? partA : partB;
  run(`${folder} ${part.toUpperCase()}`, () => fn(input), expectedA);
}

function runReal(folder: string, part: 'a' | 'b') {
  const { partA, partB, prepareInput } = loadSolution(folder);
  const { inputFile } = getFilePaths(folder);

  if (!existsSync(inputFile)) {
    console.log(yellow().bold('WARNING: Input does not exist! Skipping prod...'));
    return;
  }

  const input = prepareInput(inputFile);
  const fn = part === 'a' ? partA : partB;
  run(`${folder} ${part.toUpperCase()}`, () => fn(input));
}

// -------- Helpers

function getFilePaths(folder: string) {
  const solutionFile = `${appRootPath}/${folder}/solution.ts`;
  const testOutputFile = `${appRootPath}/${folder}/test_output`;
  const testInputFile = `${appRootPath}/${folder}/test_input`;
  const inputFile = `${appRootPath}/${folder}/input`;

  return { solutionFile, testInputFile, testOutputFile, inputFile };
}

function loadSolution(folder: string) {
  const solutionFile = `${appRootPath}/${folder}/solution.ts`;

  if (!existsSync(solutionFile)) {
    console.log(red().bold('ERROR: Solution file does not exist!'));
    process.exit();
  }

  const { partA, partB, prepareInput } = require(solutionFile);

  if (typeof partA !== 'function') {
    console.log(red().bold('ERROR: partA not a function'));
    process.exit();
  }

  if (typeof partB !== 'function') {
    console.log(red().bold('ERROR: partB not a function'));
    process.exit();
  }

  if (typeof prepareInput !== 'function') {
    console.log(red().bold('ERROR: prepareInput not a function'));
    process.exit();
  }

  return { partA, partB, prepareInput };
}

function run(name: string, runFn: () => number, expected?: number) {
  console.time(name);
  const result = runFn();
  console.timeEnd(name);
  if (expected) {
    if (result !== expected) {
      fail(name, expected, result);
    } else {
      success(name, result);
    }
  } else {
    console.log(bold(`${name} · ${yellow(result)}`));
  }
}

function fail(part: string, expected: number, received: number) {
  console.log(
    red().bold(`${part} · failed `),
    bold(`· expected: ${expected}, received: ${red(received)}`)
  );
}

function success(part: string, result: number) {
  console.log(green().bold(`${part} · success`), '· received:', bold(result));
}

function header(header: string) {
  console.log(bold().white(`${header}`));
}
