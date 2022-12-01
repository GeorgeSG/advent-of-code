import { readFileSync } from 'fs';
import kleur from 'kleur';

export const readFile = (inputFile, lineTransformer?) => {
  try {
    let input;
    input = readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });
    input = input
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    return lineTransformer
      ? input.map((line, i) => lineTransformer(line, i))
      : input;
  } catch (e) {
    console.error(kleur.red().bold('Error: unable to read input'));
  }
};
