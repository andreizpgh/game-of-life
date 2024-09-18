import p5 from "p5";

export const generateStartState = (
  p: p5,
  size: number,
  ratio: number
): number[][] => {
  const variants = new Array(ratio).fill(0).concat([1]);
  const grid = Array.from({ length: size }, () => new Array(size));

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      grid[row][column] = variants[p.floor(p.random(0, variants.length))];
    }
  }

  return grid;
};

export const display = (
  p: p5,
  grid: number[][],
  size: number,
  colors: string[]
): void => {
  const unit = p.width / size;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (grid[row]?.[column])
        p.fill(colors[Math.floor(p.random(0, colors.length))]);
      else p.fill("white");
      p.square(row * unit, column * unit, unit);
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
      const n = countNeighbors(grid, row, column, size);
      if (n > 3 || n < 2) next[row][column] = 0;
      if (n == 3) next[row][column] = 1;
      if (n == 2) next[row][column] = grid[row][column];
    }
  }

  return next;
};

const countNeighbors = (
  grid: number[][],
  row: number,
  column: number,
  size: number
): number => {
  let count = 0;

  for (let rowOffset = -1; rowOffset < 2; rowOffset++) {
    for (let columnOffset = -1; columnOffset < 2; columnOffset++) {
      count +=
        grid[(row + rowOffset + size) % size][
          (column + columnOffset + size) % size
        ];
    }
  }

  return count - grid[row][column];
};
