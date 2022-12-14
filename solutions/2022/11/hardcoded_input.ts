import { Monkey } from './solution';

export const EXAMPLE_MONKEYS: Monkey[] = [
  {
    worryPerItem: [79, 98],
    worryIncreaser: (v) => v * 19,
    worryCheck: 23,
    ifTrue: 2,
    ifFalse: 3,
  },

  {
    worryPerItem: [54, 65, 75, 74],
    worryIncreaser: (v) => v + 6,
    worryCheck: 19,
    ifTrue: 2,
    ifFalse: 0,
  },

  {
    worryPerItem: [79, 60, 97],
    worryIncreaser: (v) => v * v,
    worryCheck: 13,
    ifTrue: 1,
    ifFalse: 3,
  },

  {
    worryPerItem: [74],
    worryIncreaser: (v) => v + 3,
    worryCheck: 17,
    ifTrue: 0,
    ifFalse: 1,
  },
];

export const REAL_MONKEYS: Monkey[] = [
  {
    worryPerItem: [66, 71, 94],
    worryIncreaser: (v) => v * 5,
    worryCheck: 3,
    ifTrue: 7,
    ifFalse: 4,
  },
  {
    worryPerItem: [70],
    worryIncreaser: (v) => v + 6,
    worryCheck: 17,
    ifTrue: 3,
    ifFalse: 0,
  },
  {
    worryPerItem: [62, 68, 56, 65, 94, 78],
    worryIncreaser: (v) => v + 5,
    worryCheck: 2,
    ifTrue: 3,
    ifFalse: 1,
  },
  {
    worryPerItem: [89, 94, 94, 67],
    worryIncreaser: (v) => v + 2,
    worryCheck: 19,
    ifTrue: 7,
    ifFalse: 0,
  },
  {
    worryPerItem: [71, 61, 73, 65, 98, 98, 63],
    worryIncreaser: (v) => v * 7,
    worryCheck: 11,
    ifTrue: 5,
    ifFalse: 6,
  },
  {
    worryPerItem: [55, 62, 68, 61, 60],
    worryIncreaser: (v) => v + 7,
    worryCheck: 5,
    ifTrue: 2,
    ifFalse: 1,
  },
  {
    worryPerItem: [93, 91, 69, 64, 72, 89, 50, 71],
    worryIncreaser: (v) => v + 1,
    worryCheck: 13,
    ifTrue: 5,
    ifFalse: 2,
  },
  {
    worryPerItem: [76, 50],
    worryIncreaser: (v) => v * v,
    worryCheck: 7,
    ifTrue: 4,
    ifFalse: 6,
  },
];
