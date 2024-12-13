import { bold } from 'kleur';

export class Logger {
  constructor(private prefix: string = '') {}

  text(message: string) {
    console.log(bold().white(`${this.prefixStr}${message}`));
  }

  success(message: string) {
    console.log(bold().green(`${this.prefixStr}${message}`));
  }

  warning(message: string) {
    console.log(bold().yellow(`${this.prefixStr}WARNING: ${message}`));
  }

  error(message: string) {
    console.log(bold().red(`${this.prefixStr}ERROR: ${message}`));
  }

  private get prefixStr() {
    if (this.prefix.length === 0) {
      return '';
    }

    return `(${this.prefix}): `;
  }
}
