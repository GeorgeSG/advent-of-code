import appRootPath from 'app-root-path';
import { Table } from 'console-table-printer';
import { existsSync } from 'fs';
import { bold } from 'kleur';
import { hrtime } from 'process';
import R from 'ramda';
import { readFileRaw } from '~utils/core';
import { Logger } from '../logger';
import { FileManager } from './fileManager';

export enum Part {
  A = 'a',
  B = 'b',
  BOTH = 'both',
}

export enum Run {
  EXAMPLE = 'example',
  REAL = 'real',
  ALL = 'all',
}

export class SolutionRunner {
  private static readonly DATA_MISSING = '-';
  private fileManager: FileManager;

  private table: Table;
  private log = new Logger('Solution Runner');

  constructor(solutionFolder: string) {
    this.table = new Table({
      title: bold().white(`${solutionFolder} Results`),
      charLength: { '❌': 2, '✅': 2 },
      columns: [
        { name: 'run', title: 'Run', alignment: 'left' },
        { name: 'part', title: 'Part', alignment: 'left', color: 'white' },
        { name: 'time', title: 'Time', alignment: 'left', color: 'white' },
        { name: 'output', title: 'Output' },
        { name: 'expected', title: 'Expected' },
        { name: 'result', title: 'Result' },
      ],
    });

    this.fileManager = new FileManager(`${appRootPath}/solutions/${solutionFolder}`);
  }

  run(part: Part, run: Run) {
    const parts = part === Part.BOTH ? [Part.A, Part.B] : [part];
    const runs = run === Run.ALL ? [Run.EXAMPLE, Run.REAL] : [run];
    R.xprod(parts, runs).forEach((configuration) => this.runSingle(...configuration));
  }

  print() {
    this.table.printTable();
  }

  private runSingle(part: Part, run: Run) {
    // Check that solution exists and get handlers
    const { solutionFn, prepareInput } = this.loadSolution(part);

    // Get input and output
    const { inputFiles, outputFiles } = this.getFilePaths(run);
    if (inputFiles.length === 0) {
      this.log.warning(`Input files not found. Skipping ${run.toLowerCase()} tests!`);
      return;
    }
    const expected = outputFiles.map((outputFile) => this.getExpectedResult(outputFile, part));

    inputFiles.forEach((inputFile, i) => {
      // Run input through solution code and measure time
      const start = process.hrtime();
      const result = solutionFn(prepareInput(inputFile));
      const end = hrtime(start);
      const timeInMs = (end[0] * 1000000000 + end[1]) / 1000000;

      let time: any = timeInMs > 1000 ? timeInMs / 1000 : timeInMs;
      time = `${time.toPrecision(6).slice(0, 6)} ${timeInMs > 1000 ? 's' : 'ms'}`;

      // Add to results table
      this.table.addRow({
        output: !expected[i]
          ? bold().yellow(result)
          : result.toString() === expected[i]
          ? bold().green(result)
          : bold().red(result),
        result: !expected[i]
          ? SolutionRunner.DATA_MISSING
          : result.toString() === expected[i]
          ? '✅'
          : '❌',
        part: `Part ${part.toUpperCase()}`,
        run: run === Run.EXAMPLE ? bold().cyan(`${run} ${i + 1}`) : bold().magenta(run),
        time,
        expected: expected[i] || SolutionRunner.DATA_MISSING,
      });
    });
  }

  private getFilePaths(run: Run) {
    const { exampleInputs, exampleOutputs, realInput, realOutput } = this.fileManager.getPaths();

    return {
      inputFiles: run === Run.REAL ? [realInput].filter(Boolean) : exampleInputs,
      outputFiles: run === Run.REAL ? [realOutput].filter(Boolean) : exampleOutputs,
    };
  }

  private loadSolution(part: Part) {
    const solutionFile = this.fileManager.getSolution();

    if (!existsSync(solutionFile)) {
      this.log.error('Solution file does not exist!');
      process.exit(0);
    }

    const { partA, partB, prepareInput } = require(solutionFile);

    if (part === Part.A && typeof partA !== 'function') {
      this.log.error('`partA` function not found.');
      process.exit(0);
    }

    if (part === Part.B && typeof partB !== 'function') {
      this.log.error('`partB` function not found.');
      process.exit(0);
    }

    if (typeof prepareInput !== 'function') {
      this.log.error('`prepareInput` function not found.');
      process.exit(0);
    }

    const solutionFn = part === Part.A ? partA : partB;

    return { solutionFn, prepareInput };
  }

  private getExpectedResult(
    outputFile: string,
    part: Part
  ): string | typeof SolutionRunner.DATA_MISSING {
    const resultIndex = part === Part.A ? 0 : 1;
    const definedResults = readFileRaw(outputFile).split('\n').filter(Boolean);

    return definedResults.length >= resultIndex + 1
      ? definedResults[resultIndex]
      : SolutionRunner.DATA_MISSING;
  }
}
