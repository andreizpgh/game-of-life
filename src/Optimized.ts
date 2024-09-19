import p5 from "p5";

export const init = (p5: p5, size: number, ratio: number): Uint8Array[][] => {
  const Generations = [
    Array.from({ length: size }, () => new Uint8Array(size)),
    Array.from({ length: size }, () => new Uint8Array(size)),
  ];

  const Grid = Generations[0];

  for (let i = 0; i < size ** 2 / (ratio + 1); i++) {
    const row = Math.floor(p5.random(0, size));
    const column = Math.floor(p5.random(0, size));

    if (Grid[row][column] & 0x1) {
      i--;
    } else setCell(row, column, Grid, size);
  }

  return Generations;
};

const setCell = (
  row: number,
  column: number,
  Grid: Uint8Array[],
  size: number
): void => {
  Grid[row][column] |= 0x1;

  for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
    for (let columnOffset = -1; columnOffset < 2; columnOffset++) {
      if (rowOffset == 0 && columnOffset == 0) continue;
      Grid[(row + rowOffset + size) % size][
        (column + columnOffset + size) % size
      ] += 0x2;
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
    let isRowEmpty = true;

    for (let column = 0; column < size; column++) {
      if (!Grid[row][column]) {
        continue;
      }

      const neighbors = Grid[row][column] >> 1;
      isRowEmpty = false;

      if (Grid[row][column] & 0x1 && (neighbors < 2 || neighbors > 3)) {
        clearCell(row, column, Next, size);
        p5.fill("white");
        p5.square(row * unit, column * unit, unit);
        continue;
      }

      if (!(Grid[row][column] & 0x1) && neighbors == 3) {
        setCell(row, column, Next, size);
        p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
        p5.square(row * unit, column * unit, unit);
      }

      isRowEmpty && row++;
    }

    Generations[0] = Next;
  }
};
