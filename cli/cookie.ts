import { writeFileSync } from 'fs';
import { red } from 'kleur';
import { COOKIE_FILE } from './const';

const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 1) {
  console.log(red().bold('ERROR: Enter your session cookie'));
  process.exit();
}

writeFileSync(COOKIE_FILE, cmdArgs[0]);
