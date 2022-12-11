import {
  CommandLineAction,
  CommandLineStringListParameter,
  CommandLineStringParameter,
} from '@rushstack/ts-command-line';
import { readdirSync } from 'fs';
import { Part, Printer, RunType, SolutionRunner } from '../lib/solutionRunner';

export class CLIActionRun extends CommandLineAction {
  private task: CommandLineStringParameter;
  private parts: CommandLineStringListParameter;
  private runTypes: CommandLineStringListParameter;
  private printType: CommandLineStringListParameter;

  private solutions: string[];

  constructor() {
    super({
      actionName: 'run',
      summary: 'Runs an Advent of Code solution',
      documentation: '',
    });

    this.solutions = readdirSync('solutions').flatMap((year) => {
      const folders = readdirSync(`solutions/${year}`);
      return folders.map((folder) => `${year}/${folder}`);
    });
  }

  protected async onExecute(): Promise<void> {
    const parts: Part[] = this.parts.values.length
      ? (this.parts.values as Part[])
      : [Part.A, Part.B];
    const runTypes: RunType[] = this.runTypes.values.length
      ? (this.runTypes.values as RunType[])
      : [RunType.EXAMPLE, RunType.REAL];

    const printers: Printer[] = this.printType.values.length
      ? (this.printType.values as Printer[])
      : [Printer.TABLE];

    const runner = new SolutionRunner(this.task.value, printers);
    runner.runAll(parts, runTypes);
  }

  protected onDefineParameters(): void {
    this.task = this.defineStringParameter({
      argumentName: 'TASK',
      parameterLongName: '--task',
      parameterShortName: '-t',
      description: 'Specify which task soluton to run',
      completions: () => Promise.resolve(this.solutions),
      defaultValue: this.solutions[this.solutions.length - 1],
    });

    this.parts = this.defineStringListParameter({
      argumentName: 'PART',
      parameterLongName: '--part',
      parameterShortName: '-p',
      description: "Specify whether to run part 'a' or 'b'",
    });

    this.runTypes = this.defineStringListParameter({
      argumentName: 'RUNTYPE',
      parameterLongName: '--run',
      parameterShortName: '-r',
      description: "Specify whether to run 'example' or 'real'",
    });

    this.printType = this.defineStringListParameter({
      argumentName: 'PRINT',
      parameterLongName: '--print',
      description: 'Specify whether to print "table" or "line"',
    });
  }
}
