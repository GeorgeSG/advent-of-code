import appRoot from 'app-root-path';
import { readFileSync, writeFileSync } from 'fs';
import { copy, existsSync } from 'fs-extra';
import { green, red, yellow } from 'kleur';
import fetch, { Headers } from 'node-fetch';
import { COOKIE_FILE as SESSION_FILE } from './const';

const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 2) {
  console.log(red().bold('ERROR: Enter year and day. Example: yarn new 2021 1'));
  process.exit(0);
}

const year = cmdArgs[0];

let day = cmdArgs[1];
if (day.startsWith('0')) {
  day = day.slice(1);
}

const dayPadded = day.padStart(2, '0');

const FOLDER = `${appRoot}/${year}/${dayPadded}`;
const INPUT_FILE = `${FOLDER}/input`;

if (existsSync(FOLDER)) {
  console.error(yellow().bold(`WARNING: ${FOLDER} already exists.`));
} else {
  console.log(`Copying template to ${FOLDER}...`);
  copy('./template/', FOLDER, (err) => {
    if (err) {
      console.log(red().bold(`ERROR: ${err}`));
    } else {
      console.log(green().bold(`${FOLDER} created successfully!`));
    }
  });
}

const sessionId = readFileSync(SESSION_FILE, { encoding: 'utf-8' });

console.log('Attempting input fetch...');
if (!sessionId) {
  console.log(yellow().bold('WARNING: Set your session via yarn set-session to fetch input.'));
  process.exit(0);
}

if (existsSync(INPUT_FILE)) {
  console.log(green().bold(`File ${INPUT_FILE} already exists. Skipping download.`));
  process.exit(0);
}

const headers = new Headers({
  'User-Agent': 'github.com/GeorgeSG/advent-of-code by georgi@gar.dev',
  Cookie: `session=${sessionId}`,
});

fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
  method: 'GET',
  headers,
})
  .then((response) => response.text())
  .then((data) => writeFileSync(INPUT_FILE, data))
  .catch((e) => {
    console.log(red().bold('ERROR fetching input'));
    console.log(e);
  });
