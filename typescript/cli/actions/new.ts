import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line';
import { SolutionFactory } from '../lib/solutionFactory';

export class CLIActionNew extends CommandLineAction {
  private year: CommandLineStringParameter;
  private day: CommandLineStringParameter;

  constructor() {
    super({
      actionName: 'new',
      summary: 'Create a new solution from the predefined template.',
      documentation: '',
    });
  }

  protected onDefineParameters(): void {
    this.year = this.defineStringParameter({
      argumentName: 'YEAR',
      parameterLongName: '--year',
      parameterShortName: '-y',
      description: 'Year of solution',
      required: true,
    });

    this.day = this.defineStringParameter({
      argumentName: 'DAY',
      parameterLongName: '--day',
      parameterShortName: '-d',
      description: 'Day of solution (1 - 25)',
      required: true,
    });
  }

  protected async onExecute(): Promise<void> {
    new SolutionFactory(this.year.value, this.day.value).create();
  }
}
