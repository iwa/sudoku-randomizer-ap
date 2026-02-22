import type { Grid, Solution } from "./types";

/**
 * Checks whether the value at (row, col) conflicts with any other cell
 * in the same row, column, or 3x3 box.
 * Returns true if there is a conflict (i.e. the value is invalid).
 */
export function hasConflict(grid: Grid, row: number, col: number): boolean {
  const value = grid[row][col].value;
  if (value === null) return false;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c].value === value) return true;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col].value === value) return true;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col && grid[r][c].value === value) return true;
    }
  }

  return false;
}

/**
 * Scans the entire grid and sets `isError` on every cell that has a conflict.
 * Returns a new grid with updated error flags.
 */
export function validateGrid(grid: Grid): Grid {
  return grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      isError: hasConflict(grid, r, c),
    })),
  );
}

/**
 * Returns true if every cell in the grid has a value (no nulls).
 */
export function isGridComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell.value !== null));
}

/**
 * Returns true if the grid is fully filled and has no conflicts.
 */
export function isGridValid(grid: Grid): boolean {
  if (!isGridComplete(grid)) return false;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (hasConflict(grid, r, c)) return false;
    }
  }

  return true;
}

/**
 * Marks cells as errors if their value doesn't match the solution,
 * even when there are no visible row/column/box conflicts.
 */
export function validateAgainstSolution(grid: Grid, solution: Solution): Grid {
  return grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      isError:
        cell.value !== null && !cell.isGiven && cell.value !== solution[r][c],
    })),
  );
}
