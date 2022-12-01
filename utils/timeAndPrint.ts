import kleur from 'kleur';

export const timeAndPrint = (partA?, partB?) => {
  console.log();
  console.time('Part A');
  console.log(kleur.green().bold(partA()));
  console.timeEnd('Part A');
  console.log();

  if (partB) {
    console.time('Part B');
    console.log(kleur.green().bold(partB()));
    console.timeEnd('Part B');
  }

  console.log();
};
