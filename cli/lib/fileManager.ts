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
