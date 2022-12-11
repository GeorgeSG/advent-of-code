import { Logger } from 'cli/logger';
import { readdirSync } from 'fs';

export class FileManager {
  constructor(private solutionFolder: string) {}

  getPaths() {
    return {
      solution: this.getSolution(),
      realInput: this.getRealInput(),
      realOutput: this.getRealOutput(),
      exampleInputs: this.getExampleInputs(),
      exampleOutputs: this.getExampleOutputs(),
    };
  }

  getSolution() {
    return this.getByName('solution.ts');
  }

  getRealInput() {
    return this.getByName('input');
  }

  getRealOutput() {
    return this.getByName('output');
  }

  getExampleInputs() {
    return this.getByPrefix('example_input');
  }

  getExampleOutputs() {
    return this.getByPrefix('example_output');
  }

  printAll(logger: Logger) {
    const { solution, realInput, realOutput, exampleInputs, exampleOutputs } = this.getPaths();

    logger.text(`${this.solutionFolder} Files:`);

    const print = (name: string, path: string) => {
      logger.text(`${name.padStart(20, ' ')}: ${path}`);
    };

    print('Solution', solution);
    print('Input', realInput);
    print('Output', realOutput);

    exampleInputs.forEach((name, i) => {
      print(`Example input ${i + 1}`, name);
    });

    exampleOutputs.forEach((name, i) => {
      print(`Example output ${i + 1}`, name);
    });
  }

  private filterFiles(filter: (string) => boolean): string[] {
    return readdirSync(this.solutionFolder).filter(filter);
  }

  private getByName(filename: string): string | null {
    const files = this.filterFiles((file) => file === filename);
    if (files.length === 0) {
      return null;
    }

    return this.toFullPath(files[0]);
  }

  private getByPrefix(prefix: string): string[] {
    return this.filterFiles((file) => file.startsWith(prefix)).map(this.toFullPath.bind(this));
  }

  private toFullPath(filename: string): string {
    return `${this.solutionFolder}/${filename}`;
  }
}
