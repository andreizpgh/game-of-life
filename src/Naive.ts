import p5 from "p5";

export const generateStartState = (
  p5: p5,
  size: number,
  ratio: number
): number[][] => {
  const variants = new Array(ratio).fill(false).concat([true]);
  const grid = Array.from({ length: size }, () => new Array(size));

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      grid[row][column] = variants[p5.floor(p5.random(0, variants.length))];
    }
  }

  return grid;
};

export const display = (
  p5: p5,
  grid: number[][],
  size: number,
  colors: string[]
): void => {
  const unit = p5.width / size;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (grid[row][column])
        p5.fill(colors[Math.floor(p5.random(0, colors.length))]);
      else p5.fill("white");
      p5.square(row * unit, column * unit, unit);
    }
  }
};

export const findNextGeneration = (
  grid: number[][],
  size: number
): number[][] => {
  const next = Array.from({ length: size }, () => new Array(size));

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const n = countNeighbors(grid, size, row, column);
      if (n > 3 || n < 2) next[row][column] = false;
      if (n == 3) next[row][column] = true;
      if (n == 2) next[row][column] = grid[row][column];
    }
  }

  return next;
};

const countNeighbors = (
  grid: number[][],
  size: number,
  row: number,
  column: number
): number => {
  let count = 0;

  for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
    for (let columnOffset = -1; columnOffset < 2; columnOffset++) {
      if (rowOffset == 0 && columnOffset == 0) continue;

      count +=
        grid[(row + rowOffset + size) % size][
          (column + columnOffset + size) % size
        ];
    }
  }

  return count;
};
