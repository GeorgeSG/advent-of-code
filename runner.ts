import { existsSync, readFileSync } from 'fs';
import { bold, green, red, underline, yellow } from 'kleur';
import path from 'path';
import { toI } from '~utils/numbers';

const cmndArgs = process.argv.slice(2);
const folderArg = cmndArgs.length >= 1 ? cmndArgs[0] : null;
const typeArg = cmndArgs.length >= 2 ? cmndArgs[1] : 'both';

if (folderArg) {
  if (typeArg === 'example' || typeArg === 'both') {
    console.log(underline().bold('Example'));
    testRun(folderArg);
  }

  if (typeArg === 'real' || typeArg === 'both') {
    console.log(underline().bold('\nReal'));
    prodRun(folderArg);
  }
  console.log();
}

export function prodRun(folder: string) {
  const { partA, partB, prepareInput } = loadSolution(folder);

  const inputFile = `${path.resolve(__dirname)}/${folder}/input`;
  if (!existsSync(inputFile)) {
    console.log(yellow().bold('WARNING: Prod input does not exist! Skipping prod...'));
    return;
  }

  const input = prepareInput(inputFile);

  const parts = [
    { name: `${folder} A`, fn: () => partA(input) },
    { name: `${folder} B`, fn: () => partB(input) },
  ];

  parts.forEach(({ name, fn }) => {
    console.time(name);
    const result = fn();
    console.timeEnd(name);
    console.log(bold(`${name} · ${yellow(result)}`));
  });
}

export function testRun(folder: string) {
  const { partA, partB, prepareInput } = loadSolution(folder);

  // Load Files
  const outputFile = `${path.resolve(__dirname)}/${folder}/test_output`;
  const inputFile = `${path.resolve(__dirname)}/${folder}/test_input`;
  if (!existsSync(outputFile) || !existsSync(inputFile)) {
    console.log(yellow().bold('WARNING: Test files do not exist! Skipping tests...'));
    return;
  }

  const [expectedA, expectedB] = readFileSync(outputFile, { encoding: 'utf8', flag: 'r' })
    .split('\n')
    .map(toI);

  const input = prepareInput(inputFile);

  const parts = [
    { name: `${folder} A`, fn: () => partA(input), expected: expectedA },
    { name: `${folder} B`, fn: () => partB(input), expected: expectedB },
  ];

  parts.forEach(({ name, fn, expected }) => {
    console.time(name);
    const result = fn();
    console.timeEnd(name);
    if (result !== expected) {
      fail(name, expected, result);
    } else {
      success(name, result);
    }
  });
}

function loadSolution(folder: string) {
  const solutionFile = `./${folder}/solution.ts`;

  if (!existsSync(solutionFile)) {
    console.log(red().bold('ERROR: Solution file does not exist!'));
    process.exit(1);
  }

  const { partA, partB, prepareInput } = require(solutionFile);

  if (typeof partA !== 'function') {
    console.log(red().bold('ERROR: partA not a function'));
    process.exit(1);
  }

  if (typeof partB !== 'function') {
    console.log(red().bold('ERROR: partB not a function'));
    process.exit(1);
  }

  if (typeof prepareInput !== 'function') {
    console.log(red().bold('ERROR: prepareInput not a function'));
    process.exit(1);
  }

  return { partA, partB, prepareInput };
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
