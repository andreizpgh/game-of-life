import p5 from "p5";

export const init = (p5: p5, size: number): Uint8Array[][] => {
  const Generations = [
    Array.from({ length: size }, () => new Uint8Array(size)),
    Array.from({ length: size }, () => new Uint8Array(size)),
  ];

  const Grid = Generations[0];
  const variants = [false, false, false, false, true];

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const isAlive = variants[p5.floor(p5.random(0, variants.length))];
      isAlive && setCell(row, column, Grid, size);
    }
  }

  return Generations;
};

export const setCell = (
  row: number,
  column: number,
  Grid: Uint8Array[],
  size: number
): void => {
  if (!(Grid[row][column] & 0x1)) {
    Grid[row][column] |= 0x1;

    for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
      for (let columnOffset = -1; columnOffset < 2; columnOffset++) {
        if (rowOffset == 0 && columnOffset == 0) continue;

        Grid[(row + rowOffset + size) % size][
          (column + columnOffset + size) % size
        ] += 0x2;
      }
    }
  }
};

const clearCell = (
  row: number,
  column: number,
  Grid: Uint8Array[],
  size: number
): void => {
  Grid[row][column] -= 0x1;

  for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
    for (let columnOffset = -1; columnOffset < 2; columnOffset++) {
      if (rowOffset == 0 && columnOffset == 0) continue;

      Grid[(row + rowOffset + size) % size][
        (column + columnOffset + size) % size
      ] -= 0x2;
    }
  }
};

export const drawFirstFrame = (
  p5: p5,
  Generations: Uint8Array[][],
  size: number,
  unit: number,
  colors: string[]
): void => {
  const Grid = Generations[0];

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (Grid[row][column] & 0x1) {
        p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
        p5.square(column * unit, row * unit, unit);
        continue;
      }

      p5.fill("white");
      p5.square(column * unit, row * unit, unit);
    }
  }
};

export const update = (
  p5: p5,
  Generations: Uint8Array[][],
  size: number,
  unit: number,
  colors: string[]
): void => {
  let [Grid, Next] = Generations;
  Next = structuredClone(Grid);

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (!Grid[row][column]) {
        continue;
      }

      const neighbors = Grid[row][column] >> 1;

      if (Grid[row][column] & 0x1 && (neighbors < 2 || neighbors > 3)) {
        clearCell(row, column, Next, size);
        p5.fill("white");
        p5.square(column * unit, row * unit, unit);
        continue;
      }

      if (!(Grid[row][column] & 0x1) && neighbors == 3) {
        setCell(row, column, Next, size);
        p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
        p5.square(column * unit, row * unit, unit);
      }
    }

    Generations[0] = Next;
  }
};
