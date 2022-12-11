import { CommandLineParser } from '@rushstack/ts-command-line';
import { CLIActionCookie } from './actions/cookie';
import { CLIActionListFiles } from './actions/listFiles';
import { CLIActionNew } from './actions/new';
import { CLIActionRun } from './actions/run';

export class AdventOfCodeCommandLine extends CommandLineParser {
  constructor() {
    super({
      toolFilename: 'aoc',
      toolDescription: 'Advent of Code CLI',
    });

    this.addAction(new CLIActionNew());
    this.addAction(new CLIActionCookie());
    this.addAction(new CLIActionRun());
    this.addAction(new CLIActionListFiles());
  }

  protected onExecute(): Promise<void> {
    return super.onExecute();
  }
}

const commandLine = new AdventOfCodeCommandLine();
commandLine.execute();
