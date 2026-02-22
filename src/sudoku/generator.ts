import type { CellValue, Grid, Difficulty, Solution, Cell } from "./types";
import { DIFFICULTY_GIVENS } from "./types";

/**
 * Shuffles an array using Fisher-Yates.
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Checks whether placing `value` at (row, col) is valid in the raw number grid.
 */
function isValidPlacement(
  grid: CellValue[][],
  row: number,
  col: number,
  value: number,
): boolean {
  // row & col check
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === value || grid[i][col] === value) {
      return false;
    }
  }

  // box check
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      if (grid[r][c] === value) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Fills the grid completely using randomized backtracking.
 * Returns true if a valid complete grid was produced.
 */
function fillGrid(grid: CellValue[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== null) continue;

      const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      for (const num of candidates) {
        if (isValidPlacement(grid, row, col, num)) {
          grid[row][col] = num as CellValue;
          if (fillGrid(grid)) return true;
          grid[row][col] = null;
        }
      }

      return false; // trigger backtrack
    }
  }

  return true; // grid is fully filled
}

/**
 * Counts the number of solutions for a grid (stops at 2 to save time).
 */
function countSolutions(grid: CellValue[][], limit: number = 2): number {
  let count = 0;

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== null) continue;

        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num as CellValue;
            if (solve()) return true;
            grid[row][col] = null;
          }
        }

        return false;
      }
    }

    // Reached a complete solution
    count++;
    return count >= limit;
  }

  solve();
  return count;
}

/**
 * Removes cells from a completed grid to reach the target number of givens,
 * ensuring the puzzle still has a unique solution.
 */
function removeCells(grid: CellValue[][], givens: number): void {
  const totalCells = 81;
  let toRemove = totalCells - givens;

  // Build a shuffled list of all cell positions
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  for (const [row, col] of positions) {
    if (toRemove <= 0) break;
    if (grid[row][col] === null) continue;

    const backup = grid[row][col];
    grid[row][col] = null;

    // Deep copy for solution counting so we don't mutate the working grid
    const copy = grid.map((row) => [...row]);

    if (countSolutions(copy) !== 1) {
      // Removing this cell would create multiple solutions — put it back
      grid[row][col] = backup;
    } else {
      toRemove--;
    }
  }
}

/**
 * Generates a sudoku puzzle Grid for the given difficulty.
 * Returns the puzzle grid (with `isGiven: true` for pre-filled cells)
 * and the complete solution.
 */
export function generateGrid(difficulty: Difficulty): {
  grid: Grid;
  solution: Solution;
} {
  const givens = DIFFICULTY_GIVENS[difficulty];

  // Create and fill a complete valid grid
  const board: CellValue[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null),
  );
  fillGrid(board);

  // Save the full solution before removing cells
  const solution: Solution = board.map((row) => row.map((value) => value));

  // Remove cells to match difficulty
  removeCells(board, givens);

  // Convert to Grid type
  const grid: Grid = board.map((row) =>
    row.map((value) => ({
      value: value,
      isGiven: value !== null,
      isError: false,
    })),
  );

  return { grid, solution };
}
