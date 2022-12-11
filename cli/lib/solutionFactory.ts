import appRootPath from 'app-root-path';
import { readFileSync, writeFileSync } from 'fs';
import { copy, existsSync } from 'fs-extra';
import fetch, { Headers } from 'node-fetch';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { COOKIE_FILE as SESSION_FILE } from '../const';
import { Logger } from '../logger';
import { FileManager } from './fileManager';

export class SolutionFactory {
  private year: string;
  private day: string;
  private folder: string;
  private fileManager: FileManager;

  private log = new Logger();

  constructor(year: string, day: string) {
    this.year = year;
    this.day = day.startsWith('0') ? day.slice(1) : day;
    this.folder = `${appRootPath}/solutions/${year}/${this.day.padStart(2, '0')}`;
    this.fileManager = new FileManager(this.folder);
  }

  create() {
    this.createFolder();
    this.fetchInput();
    this.listFiles();
  }

  listFiles() {
    const { solution, realInput, realOutput, exampleInputs, exampleOutputs } =
      this.fileManager.getPaths();

    this.log.text(`${this.year}/${this.day} Files:`);

    const print = (name: string, path: string) => {
      this.log.text(`${name.padStart(20, ' ')}: ${path}`);
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

  createFolder() {
    if (existsSync(this.folder)) {
      this.log.warning(`${this.folder} already exists. Skipping folder creation.`);
      return true;
    }

    console.log(`Copying template to ${this.folder}...`);
    copy('./template/', this.folder, (err) => {
      if (err) {
        this.log.error(err);
      } else {
        this.log.success(`${this.folder}/solution.ts created successfully!`);
      }
    });
  }

  fetchInput() {
    const inputFile = `${this.folder}/input`;

    if (!fileExistsSync(SESSION_FILE)) {
      this.log.warning('Set your session via pnpm set-cookie to fetch input.');
      return;
    }

    const sessionId = readFileSync(SESSION_FILE, { encoding: 'utf-8' });

    if (existsSync(inputFile)) {
      this.log.warning(`Input file already exists. Skipping download.`);
    } else {
      console.log('Attempting input fetch...');
      const headers = new Headers({
        'User-Agent': 'github.com/GeorgeSG/advent-of-code by georgi@gar.dev',
        Cookie: `session=${sessionId}`,
      });

      fetch(`https://adventofcode.com/${this.year}/day/${this.day}/input`, {
        method: 'GET',
        headers,
      })
        .then((response) => response.text())
        .then((data) => {
          writeFileSync(inputFile, data);
          this.log.success(`Input for ${this.year}/day/${this.day} downloaded successfully.`);
        })
        .catch((e) => this.log.error('Unable to fetch input.'));
    }
  }
}
