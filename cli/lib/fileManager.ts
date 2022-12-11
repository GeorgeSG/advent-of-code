export class FileManager {
  constructor(private solutionFolder: string) {}

  getPaths() {
    const solution = this.getSolution();
    const testInputFile = `${this.solutionFolder}/example_input`;
    const testOutputFile = `${this.solutionFolder}/example_output`;
    const realInputFile = `${this.solutionFolder}/input`;
    const realOutputFile = `${this.solutionFolder}/output`;

    return { solution, testInputFile, testOutputFile, realInputFile, realOutputFile };
  }

  getSolution() {
    return `${this.solutionFolder}/solution.ts`;
  }
}
