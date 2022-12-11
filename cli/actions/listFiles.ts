import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line';
import { FileManager } from 'cli/lib/fileManager';
import { Logger } from 'cli/logger';
import { readdirSync } from 'fs';

export class CLIActionListFiles extends CommandLineAction {
  private task: CommandLineStringParameter;
  private solutions: string[];
  private logger = new Logger();

  constructor() {
    super({
      actionName: 'files',
      summary: 'Lists files for a task',
      documentation: '',
    });

    this.solutions = readdirSync('solutions').flatMap((year) => {
      const folders = readdirSync(`solutions/${year}`);
      return folders.map((folder) => `${year}/${folder}`);
    });
  }

  protected async onExecute(): Promise<void> {
    const fileManager = new FileManager(`solutions/${this.task.value}`);
    fileManager.printAll(this.logger);
  }

  protected onDefineParameters(): void {
    this.task = this.defineStringParameter({
      argumentName: 'TASK',
      parameterLongName: '--task',
      parameterShortName: '-t',
      description: 'Specify which task soluton to list files for',
      completions: () => Promise.resolve(this.solutions),
      defaultValue: this.solutions[this.solutions.length - 1],
    });
  }
}
