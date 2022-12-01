import appRoot from 'app-root-path';
import { copy, existsSync } from 'fs-extra';
import { green, red, yellow } from 'kleur';

const cmdArgs = process.argv.slice(2);
const folderArg = cmdArgs.length >= 1 ? cmdArgs[0] : null;

if (!folderArg) {
  console.log(yellow().bold('WARNING: Enter folder name. Example: 2022/02'));
}

if (existsSync(`${appRoot}/${folderArg}`)) {
  console.error(red().bold(`ERROR: ${folderArg} already exists`));
  process.exit(0);
}

copy('./template/', folderArg, (err) => {
  if (err) {
    console.log(red().bold(`ERROR: ${err}`));
  } else {
    console.log(green().bold(`${folderArg} created successfully!`));
  }
});
