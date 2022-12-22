export const example_22 = {
  cubeSide: 4,
  SWITCH_SIDES: {
    1: [6, 4, 3, 2],
    2: [3, 5, 6, 1],
    3: [4, 5, 2, 1],
    4: [6, 5, 3, 1],
    5: [6, 2, 3, 4],
    6: [1, 2, 5, 4],
  },

  SWITCH_COORDS: {
    1: [
      ({ x, y }, n) => ({ x: n - x, y: n }),
      ({ y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x: 0, y: x }),
      ({ x, y }, n) => ({ x: 0, y: n - y }),
    ],
    2: [
      ({ x, y }, n) => ({ x, y: 0 }),
      ({ x, y }, n) => ({ x: n, y: n - y }),
      ({ x, y }, n) => ({ x: n, y: n - x }),
      ({ x, y }, n) => ({ x: 0, y: n - y }),
    ],

    3: [
      ({ x, y }, n) => ({ x, y: 0 }),
      ({ x, y }, n) => ({ x: n - y, y: 0 }),
      ({ x, y }, n) => ({ x, y: n }),
      ({ x, y }, n) => ({ x: y, y: 0 }),
    ],
    4: [
      ({ x, y }, n) => ({ x: 0, y: n - x }),
      ({ x, y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x, y: n }),
      ({ x, y }, n) => ({ x: n, y }),
    ],
    5: [
      ({ x, y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x: n, y: n - y }),
      ({ x, y }, n) => ({ x: n, y: n - x }),
      ({ x, y }, n) => ({ x: n, y }),
    ],
    6: [
      ({ x, y }, n) => ({ x: n - x, y: n }),
      ({ x, y }, n) => ({ x: n - y, y: 0 }),
      ({ x, y }, n) => ({ x, y: n }),
      ({ x, y }, n) => ({ x: n - y, y: n }),
    ],
  },

  SWITCH_FACING: {
    1: [2, 1, 1, 1],
    2: [0, 3, 3, 1],
    3: [0, 0, 2, 2],
    4: [1, 1, 2, 1],
    5: [0, 3, 3, 3],
    6: [2, 0, 2, 2],
  },

  computeSides(map: string[]): string[][] {
    const sides: string[][] = [
      ['i am a dummy, because sides are labelled 1-6'],
      [],
      [],
      [],
      [],
      [],
      [],
    ];

    const cubeSide = map.length / 3;
    for (let i = 0; i < cubeSide; i++) {
      sides[1].push(map[i].trim());
    }

    for (let i = cubeSide; i < cubeSide * 2; i++) {
      sides[2].push(map[i].slice(0, cubeSide));
      sides[3].push(map[i].slice(cubeSide, cubeSide * 2));
      sides[4].push(map[i].slice(cubeSide * 2).trim());
    }

    for (let i = cubeSide * 2; i < map.length; i++) {
      sides[5].push(map[i].slice(cubeSide * 2, cubeSide * 3));
      sides[6].push(map[i].slice(cubeSide * 3));
    }

    return sides;
  },
  finalCoords(cubeSide) {
    return {
      1: ({ x, y }) => ({ x, y: 2 * cubeSide + y }),
      2: ({ x, y }) => ({ x: cubeSide + x, y }),
      3: ({ x, y }) => ({ x: cubeSide + x, y: cubeSide + y }),
      4: ({ x, y }) => ({ x: cubeSide + x, y: 2 * cubeSide + y }),
      5: ({ x, y }) => ({ x: 2 * cubeSide + x, y: 2 * cubeSide + y }),
      6: ({ x, y }) => ({ x: 2 * cubeSide + x, y: 3 * cubeSide + y }),
    };
  },
};

export const real_22 = {
  cubeSide: 50,
  SWITCH_SIDES: {
    1: [2, 3, 4, 6],
    2: [5, 3, 1, 6],
    3: [2, 5, 4, 1],
    4: [5, 6, 1, 3],
    5: [2, 6, 4, 3],
    6: [5, 2, 1, 4],
  },
  SWITCH_COORDS: {
    1: [
      ({ x, y }, n) => ({ x, y: 0 }),
      ({ x, y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x: n - x, y: 0 }),
      ({ x, y }, n) => ({ x: y, y: 0 }),
    ],
    2: [
      ({ x, y }, n) => ({ x: n - x, y: n }),
      ({ x, y }, n) => ({ x: y, y: n }),
      ({ x, y }, n) => ({ x, y: n }),
      ({ x, y }, n) => ({ x: n, y }),
    ],
    3: [
      ({ x, y }, n) => ({ x: n, y: x }),
      ({ x, y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x: 0, y: x }),
      ({ x, y }, n) => ({ x: n, y }),
    ],
    4: [
      ({ x, y }, n) => ({ x, y: 0 }),
      ({ x, y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x: n - x, y: 0 }),
      ({ x, y }, n) => ({ x: y, y: 0 }),
    ],
    5: [
      ({ x, y }, n) => ({ x: n - x, y: n }),
      ({ x, y }, n) => ({ x: y, y: n }),
      ({ x, y }, n) => ({ x, y: n }),
      ({ x, y }, n) => ({ x: n, y }),
    ],
    6: [
      ({ x, y }, n) => ({ x: n, y: x }),
      ({ x, y }, n) => ({ x: 0, y }),
      ({ x, y }, n) => ({ x: 0, y: x }),
      ({ x, y }, n) => ({ x: n, y }),
    ],
  },
  SWITCH_FACING: {
    1: [0, 1, 0, 0],
    2: [2, 2, 2, 3],
    3: [3, 1, 1, 3],
    4: [0, 1, 0, 0],
    5: [2, 2, 2, 3],
    6: [3, 1, 1, 3],
  },
  computeSides(map: string[]): string[][] {
    const sides: string[][] = [
      ['i am a dummy, because sides are labelled 1-6'],
      [],
      [],
      [],
      [],
      [],
      [],
    ];

    const cubeSide = 50;
    for (let i = 0; i < cubeSide; i++) {
      sides[1].push(map[i].slice(cubeSide, 2 * cubeSide));
      sides[2].push(map[i].slice(2 * cubeSide, 3 * cubeSide));
    }

    for (let i = cubeSide; i < cubeSide * 2; i++) {
      sides[3].push(map[i].slice(cubeSide, 2 * cubeSide));
    }

    for (let i = cubeSide * 2; i < cubeSide * 3; i++) {
      sides[4].push(map[i].slice(0, cubeSide));
      sides[5].push(map[i].slice(cubeSide, 2 * cubeSide));
    }

    for (let i = cubeSide * 3; i < cubeSide * 4; i++) {
      sides[6].push(map[i].slice(0, cubeSide));
    }
    return sides;
  },
  finalCoords(cubeSide) {
    return {
      1: ({ x, y }) => ({ x, y: cubeSide + y }),
      2: ({ x, y }) => ({ x, y: 2 * cubeSide + y }),
      3: ({ x, y }) => ({ x: cubeSide + x, y: cubeSide + y }),
      4: ({ x, y }) => ({ x: 2 * cubeSide + x, y }),
      5: ({ x, y }) => ({ x: 2 * cubeSide + x, y: cubeSide + y }),
      6: ({ x, y }) => ({ x: 3 * cubeSide + x, y }),
    };
  },
};
