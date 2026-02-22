import type { Grid, Solution } from "./types";

/**
 * Checks whether the value at (row, col) conflicts with any other cell
 * in the same row, column, or 3x3 box.
 * Returns true if there is a conflict (i.e. the value is invalid).
 */
function hasConflict(grid: Grid, row: number, col: number): boolean {
  const value = grid[row][col].value;
  if (value === null) return false;

  // row & col check
  for (let i = 0; i < 9; i++) {
    if (
      (i !== col && grid[row][i].value === value) ||
      (i !== row && grid[i][col].value === value)
    ) {
      return true;
    }
  }

  // box check
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      if (r !== row && c !== col && grid[r][c].value === value) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Scans the entire grid and sets `isError` on every cell that has either
 * a conflict or do not match the solution.
 * Cells can be marked as errors even if there are no visible conflicts.
 * Returns a new grid with updated error flags.
 */
export function validateGrid(grid: Grid, solution: Solution): Grid {
  const conflictsGrid = grid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      isError: hasConflict(grid, r, c),
    })),
  );

  return conflictsGrid.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      isError:
        cell.isError || // preserve if already errored
        (cell.value !== null && !cell.isGiven && cell.value !== solution[r][c]),
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
 * Returns true if the grid is fully filled, has no conflicts and matches the solution.
 */
export function isGridValid(grid: Grid, solution: Solution): boolean {
  if (!isGridComplete(grid)) return false;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (hasConflict(grid, r, c)) return false;
      if (grid[r][c].value !== solution[r][c]) return false;
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
