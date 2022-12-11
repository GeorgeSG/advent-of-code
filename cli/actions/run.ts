import {
  CommandLineAction,
  CommandLineChoiceParameter,
  CommandLineStringParameter,
} from '@rushstack/ts-command-line';
import { readdirSync } from 'fs';
import { Part, Run, SolutionRunner } from '../lib/solutionRunner';

export class CLIActionRun extends CommandLineAction {
  private task: CommandLineStringParameter;
  private part: CommandLineChoiceParameter;
  private run: CommandLineChoiceParameter;

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
    const runner = new SolutionRunner(this.task.value);
    runner.run(this.part.value as Part, this.run.value as Run);
    runner.print();
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

    this.part = this.defineChoiceParameter({
      parameterLongName: '--part',
      parameterShortName: '-p',
      description: 'Specify whether to run Part A, Part B, or both',
      alternatives: Object.values(Part),
      defaultValue: Part.BOTH,
    });

    this.run = this.defineChoiceParameter({
      parameterLongName: '--run',
      parameterShortName: '-r',
      description: 'Specify whether to run example, real, or all tests',
      alternatives: Object.values(Run),
      defaultValue: Run.ALL,
    });
  }
}
