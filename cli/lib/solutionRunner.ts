import appRootPath from 'app-root-path';
import { Table } from 'console-table-printer';
import { existsSync } from 'fs';
import { bold } from 'kleur';
import { hrtime } from 'process';
import R from 'ramda';
import { readFileRaw } from '~utils/core';
import { Logger } from '../logger';
import { FileManager } from './fileManager';
import { SolutionFactory } from './solutionFactory';

export enum Part {
  A = 'a',
  B = 'b',
}

export enum RunType {
  EXAMPLE = 'example',
  REAL = 'real',
}

export enum Printer {
  TABLE = 'table',
  LINE = 'line',
}

export type RunContext = {
  runType: RunType;
  runIndex: number;
};

export class SolutionRunner {
  private static readonly DATA_MISSING = '-';
  private fileManager: FileManager;
  private solutionFolder: string;

  private table: Table;
  private logger = new Logger('Solution Runner');

  constructor(solutionFolder: string, private printers: Printer[]) {
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

    this.solutionFolder = solutionFolder;
    this.fileManager = new FileManager(`${appRootPath}/solutions/${solutionFolder}`);
  }

  async runAll(parts: Part[], runs: RunType[]) {
    if (runs.includes(RunType.REAL)) {
      await this.fetchRealInput();
    }

    await Promise.all(
      R.xprod(runs, parts).map((configuration) => this.runByPartAndRunType(...configuration))
    );

    if (this.printers.includes(Printer.TABLE)) {
      this.table.printTable();
    }
  }

  private async fetchRealInput(): Promise<void> {
    const { inputFiles } = this.getFilePaths(RunType.REAL);
    if (inputFiles.length > 0) {
      return Promise.resolve();
    }

    this.logger.warning(`Input files not found. Attempting to download input...`);
    const solutionFactory = new SolutionFactory(
      this.solutionFolder.split('/')[0],
      this.solutionFolder.split('/')[1]
    );
    const downloadFile = await solutionFactory.fetchInput();
    if (!downloadFile) {
      this.logger.error(`Unable to download task input. Skipping real tests!`);
      return;
    }
  }

  private async runByPartAndRunType(runType: RunType, part: Part) {
    // Check that solution exists and get handlers
    const { solutionFn, prepareInput } = this.loadSolution(part);

    // Get input and output
    const { inputFiles, outputFiles } = this.getFilePaths(runType);
    if (inputFiles.length === 0) {
      this.logger.error(`Input files not found. Skipping ${runType.toLowerCase()} tests!`);
      return;
    }
    const expected = outputFiles.map((outputFile) => this.getExpectedResult(outputFile, part));

    inputFiles.forEach((inputFile, i) => {
      // Run input through solution code and measure time
      const start = process.hrtime();
      const result = solutionFn(prepareInput(inputFile), {
        runType,
        runIndex: i,
      } as RunContext);
      const end = hrtime(start);
      const timeInMs = (end[0] * 1000000000 + end[1]) / 1000000;

      let time: any = timeInMs > 1000 ? timeInMs / 1000 : timeInMs;
      time = `${time.toPrecision(6).slice(0, 6)} ${timeInMs > 1000 ? 's' : 'ms'}`;

      const output = {
        output:
          !expected[i] || expected[i] === SolutionRunner.DATA_MISSING
            ? bold().yellow(result)
            : result.toString() === expected[i]
            ? bold().green(result)
            : bold().red(result),
        result:
          !expected[i] || expected[i] === SolutionRunner.DATA_MISSING
            ? SolutionRunner.DATA_MISSING
            : result.toString() === expected[i]
            ? '✅'
            : '❌',
        part: `Part ${part.toUpperCase()}`,
        run:
          runType === RunType.EXAMPLE
            ? bold().cyan(`${runType} ${i + 1}`)
            : bold().magenta(runType),
        time,
        expected: expected[i] || SolutionRunner.DATA_MISSING,
      };

      if (this.printers.includes(Printer.LINE)) {
        this.logger.text(`${output.part}, ${output.run}:`);
        console.log(`${output.result} result: ${output.output} expected: ${output.expected}`);
        console.log('');
      }

      // Add to results table
      this.table.addRow(output);
    });
  }

  private getFilePaths(runType: RunType) {
    const { exampleInputs, exampleOutputs, realInput, realOutput } = this.fileManager.getPaths();

    return {
      inputFiles: runType === RunType.REAL ? [realInput].filter(Boolean) : exampleInputs,
      outputFiles: runType === RunType.REAL ? [realOutput].filter(Boolean) : exampleOutputs,
    };
  }

  private loadSolution(part: Part) {
    const solutionFile = this.fileManager.getSolution();

    if (!existsSync(solutionFile)) {
      this.logger.error('Solution file does not exist!');
      process.exit(0);
    }

    const { partA, partB, prepareInput } = require(solutionFile);

    if (part === Part.A && typeof partA !== 'function') {
      this.logger.error('`partA` function not found.');
      process.exit(0);
    }

    if (part === Part.B && typeof partB !== 'function') {
      this.logger.error('`partB` function not found.');
      process.exit(0);
    }

    if (typeof prepareInput !== 'function') {
      this.logger.error('`prepareInput` function not found.');
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
