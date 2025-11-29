import { readFileSync } from 'fs';
import { Logger } from 'cli/logger';

const logger = new Logger();

export const readFile = <T = string>(
  inputFile: string,
  lineTransformer?: (line: string, index: number) => T
): T[] => {
  try {
    let input;
    input = readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });
    input = input
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    return lineTransformer ? input.map((line, i) => lineTransformer(line, i)) : input;
  } catch (e) {
    logger.error('Unable to read input');
  }
};

export const readFileRaw = (inputFile) => {
  try {
    return readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });
  } catch (e) {
    logger.error('Unable to read input');
  }
};
