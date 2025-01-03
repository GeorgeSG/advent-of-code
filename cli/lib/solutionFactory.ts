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

  private logger = new Logger('Solution Factory');

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
    this.fileManager.printAll(this.logger);
  }

  createFolder() {
    if (existsSync(this.folder)) {
      this.logger.warning(`${this.folder} already exists. Skipping folder creation.`);
      return true;
    }

    this.logger.text(`Copying template to ${this.folder}...`);
    copy('./template/', this.folder, (err) => {
      if (err) {
        this.logger.error(err);
      } else {
        this.logger.success(`${this.folder}/solution.ts created successfully!`);
      }
    });
  }

  async fetchInput() {
    const inputFile = `${this.folder}/input`;

    if (!fileExistsSync(SESSION_FILE)) {
      this.logger.warning('Set your session via pnpm set-cookie to fetch input.');
      return false;
    }

    const sessionId = readFileSync(SESSION_FILE, { encoding: 'utf-8' });

    if (existsSync(inputFile)) {
      this.logger.warning(`Input file already exists. Skipping download.`);
      return true;
    } else {
      this.logger.text('Fetching real input...');
      const headers = new Headers({
        'User-Agent': 'github.com/GeorgeSG/advent-of-code by georgi@gar.dev',
        Cookie: `session=${sessionId}`,
      });

      try {
        const response = await fetch(
          `https://adventofcode.com/${this.year}/day/${this.day}/input`,
          {
            method: 'GET',
            headers,
          }
        );
        const data = await response.text();
        writeFileSync(inputFile, data);
        this.logger.success(`Input for ${this.year}/${this.day} downloaded successfully.`);
        return true;
      } catch (e) {
        this.logger.error('Unable to fetch input.');
        return false;
      }
    }
  }
}
