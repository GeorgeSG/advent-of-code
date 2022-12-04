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

### `yarn new 2022 01`
Create a Solution folder 2022/01 using a predefined template. Attempt to automatically fetch and populate input.

### `yarn test 2022/01 [example | real | both]`
Run the tests for 2022/01 once. Defaults to running both example and real tests.

### `yarn watch 2022/01 [example | real | both]`
Run the tests for 2022/01 and watch for changes. Defaults to running both example and real tests.

### `yarn set-cookie [cookie]`
Store your session cookie value locally to be able to automatically fetch input.
