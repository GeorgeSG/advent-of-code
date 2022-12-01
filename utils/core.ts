import { readFileSync } from 'fs';
import { green, red } from 'kleur';

export const timeAndPrint = (partA?, partB?) => {
  console.log('Part A:');
  console.time('Time');
  console.log(green().bold(partA()));
  console.timeEnd('Time');
  console.log('\n---\n');

  if (partB) {
    console.log('Part B:');
    console.time('Time');
    console.log(green().bold(partB()));
    console.timeEnd('Time');
  }

  console.log();
};

export const readFile = (inputFile, lineTransformer?) => {
  try {
    let input;
    input = readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });
    input = input
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    return lineTransformer ? input.map((line, i) => lineTransformer(line, i)) : input;
  } catch (e) {
    console.error(red().bold('Error: unable to read input'));
  }
};

export const readFileRaw = (inputFile) => {
  try {
    return readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });
  } catch (e) {
    console.error(red().bold('Error: unable to read input'));
  }
};
