import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line';
import { writeFileSync } from 'fs';
import { COOKIE_FILE } from '../const';

export class CLIActionCookie extends CommandLineAction {
  private cookie: CommandLineStringParameter;

  constructor() {
    super({
      actionName: 'cookie',
      summary: 'Set session cookie for automatic input downloading',
      documentation: '',
    });
  }

  protected onDefineParameters(): void {
    this.cookie = this.defineStringParameter({
      argumentName: 'COOKIE_VALUE',
      parameterLongName: '--cookie',
      parameterShortName: '-c',
      description: 'Value of your adventofcode.com session cookie',
      required: true,
    });
  }

  protected async onExecute(): Promise<void> {
    writeFileSync(COOKIE_FILE, this.cookie.value);
  }
}
