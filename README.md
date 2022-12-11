# advent-of-code

These are my [Advent of Code](https://adventofcode.com) solutions.

Included is a small "framework" I wrote to help me run and test the solutions.

## Code
### Solution folders

Each solution is in a folder named `<year>/<solutuon-day>`. Example: `2022/02`.

Each solution folder contains the following files:
- `solution.ts` - code for the solution
- `input` - task input
- `output` - (optional) task output - each part on a new line
- `example_input` - the example input given in the task description
- `example_output` - the example answers given in the task description - each part on a new line

See "Commands" below for creating a new solution folders.

### Solution file
Each `solution.ts` file must export the following functions:

```ts
/**
 * @param inputFile - location of an input
 * @returns parsed input ready for computations
 */
export function prepareInput(inputFile: string): Input {}

/**
 * @param input - prepared input as returned by prepareInput
 * @returns solution for part A
 */
export function partA(input: Input): number {}

/**
 * @param input - prepared input as returned by prepareInput
 * @returns solution for part B
 */
export function partB(input: Input): number {}
```

### Utils
There are useful utils in `./utils`. Check them out :)

## Commands

#### `pnpm new -y 2022 -d 01`
Create a Solution folder 2022/01 using a predefined template. Attempt to automatically fetch and populate input.

Man page:
```
usage: pnpm new [-h] -y YEAR -d DAY

Optional arguments:
  -h, --help            Show this help message and exit.
  -y YEAR, --year YEAR  Year of solution
  -d DAY, --day DAY     Day of solution (1 - 25)
```

#### `pnpm test -t TASK -p PART -r RUN_TYPE --print PRINTER`
Run tests for a given task once.
Defaults to running all parts and all run types for the latest solution using a table printer.

Arguments:
- `-p`: `a` or `b`
- `-r`: `example` or `real`
- `--print`: `table` or `line`

You can select multiple argument values by passing the argument twice: `-p a -p b`

Example:
```
pnpm test -t 2021/09 -p a -p b -r example --print table --print line
```

Man page:
```
usage: pnpm test [-h] [-t TASK] [-p PART] [-r RUNTYPE] [--print PRINT]

Optional arguments:
  -h, --help            Show this help message and exit.
  -t TASK, --task TASK  Specify which task soluton to run. The default value
                        is "2022/11".
  -p PART, --part PART  Specify whether to run part 'a' or 'b'
  -r RUNTYPE, --run RUNTYPE
                        Specify whether to run 'example' or 'real'
  --print PRINT         Specify whether to print "table" or "line"
```

#### `pnpm watch -t TASK -p PART -r RUN_TYPE --print PRINTER`
Run the tests for a given task and watches for changes.

#### `pnpm files -t TASK`
List the files for a given task.


Man page:
```
usage: pnpm files [-h] [-t TASK]

Optional arguments:
  -h, --help            Show this help message and exit.
  -t TASK, --task TASK  Specify which task soluton to list files for. The
                        default value is "2022/11".
```

#### `pnpm set-cookie [cookie]`
Store your session cookie value locally to be able to automatically fetch input.
