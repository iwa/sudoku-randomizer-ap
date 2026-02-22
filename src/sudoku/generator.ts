import type { CellValue, Grid, Difficulty, Solution } from "./types";
import { DIFFICULTY_GIVENS } from "./types";

/**
 * Shuffles an array in place using Fisher-Yates.
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
function isValid(
  board: (number | null)[][],
  row: number,
  col: number,
  value: number,
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === value) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === value) return false;
    }
  }

  return true;
}

/**
 * Fills the board completely using randomized backtracking.
 * Returns true if a valid complete board was produced.
 */
function fillBoard(board: (number | null)[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== null) continue;

      const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      for (const num of candidates) {
        if (isValid(board, r, c, num)) {
          board[r][c] = num;
          if (fillBoard(board)) return true;
          board[r][c] = null;
        }
      }

      return false; // trigger backtrack
    }
  }

  return true; // board is fully filled
}

/**
 * Counts the number of solutions for a board (stops at 2 to save time).
 */
function countSolutions(board: (number | null)[][], limit: number = 2): number {
  let count = 0;

  function solve(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== null) continue;

        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solve()) return true;
            board[r][c] = null;
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
 * Removes cells from a completed board to reach the target number of givens,
 * ensuring the puzzle still has a unique solution.
 */
function removeCells(board: (number | null)[][], givens: number): void {
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

  for (const [r, c] of positions) {
    if (toRemove <= 0) break;
    if (board[r][c] === null) continue;

    const backup = board[r][c];
    board[r][c] = null;

    // Deep copy for solution counting so we don't mutate the working board
    const copy = board.map((row) => [...row]);

    if (countSolutions(copy) !== 1) {
      // Removing this cell would create multiple solutions — put it back
      board[r][c] = backup;
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

  // Create and fill a complete valid board
  const board: (number | null)[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null),
  );
  fillBoard(board);

  // Save the full solution before removing cells
  const solution: Solution = board.map((row) =>
    row.map((value) => value as CellValue),
  );

  // Remove cells to match difficulty
  removeCells(board, givens);

  // Convert to Grid type
  const grid: Grid = board.map((row) =>
    row.map((value) => ({
      value: value as CellValue,
      isGiven: value !== null,
      isError: false,
    })),
  );

  return { grid, solution };
}
