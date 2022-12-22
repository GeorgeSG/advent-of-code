export const example_22 = {
  cubeSide: 4,
  // NEIGHBOURS: right/down/left/up neighbour -> side & rotaton
  // prettier-ignore
  NEIGHBOURS: {
    1: [ [6, 180], [4, 0], [3, 90], [2, 180], ],
    2: [ [3, 0], [5, 180], [6, 270], [1, 180], ],
    3: [ [4, 90], [5, 90], [2, 0], [1, 270], ],
    4: [ [6, 270], [5, 0], [3, 0], [1, 0], ],
    5: [ [6, 0], [2, 180], [3, 270], [4, 0], ],
    6: [ [1, 180], [2, 90], [5, 0], [4, 90], ],
  },

  extractSides(map: string[]): string[][] {
    const sides: string[][] = [['dummy'], [], [], [], [], [], []];
    const cubeSide = 4;

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
  remapCoordsToMap(cubeSide) {
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
  // NEIGHBOURS: right/down/left/up neighbour -> side & rotaton
  // prettier-ignore
  NEIGHBOURS: {
    1: [ [2, 0], [3, 0], [4, 180], [6, 270], ],
    2: [ [5, 180], [3, 270], [1, 0], [6, 0], ],
    3: [ [2, 90], [5, 0], [4, 90], [1, 0], ],
    4: [ [5, 0], [6, 0], [1, 180], [3, 270], ],
    5: [ [2, 180], [6, 270], [4, 0], [3, 0], ],
    6: [ [5, 90], [2, 0], [1, 90], [4, 0], ],
  },

  extractSides(map: string[]): string[][] {
    const sides: string[][] = [['dummy'], [], [], [], [], [], []];
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

  remapCoordsToMap(cubeSide) {
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
