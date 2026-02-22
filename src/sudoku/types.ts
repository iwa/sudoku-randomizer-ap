export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export type Difficulty = "easy" | "normal" | "hard";

export const DIFFICULTY_GIVENS: Record<Difficulty, number> = {
  easy: 80,
  normal: 35,
  hard: 24,
};

export type Cell = {
  value: CellValue;
  isGiven: boolean;
  isError: boolean;
};

export type Grid = Cell[][];

/** The complete solution board — a 9×9 matrix of filled CellValues (no nulls). */
export type Solution = CellValue[][];
