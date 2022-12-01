import kleur from 'kleur';

export const timeAndPrint = (partA?, partB?) => {
  console.log('Part A:');
  console.time('Time');
  console.log(kleur.green().bold(partA()));
  console.timeEnd('Time');
  console.log('\n---\n');

  if (partB) {
    console.log('Part B:');
    console.time('Time');
    console.log(kleur.green().bold(partB()));
    console.log();
    console.timeEnd('Time');
  }

  console.log();
};
