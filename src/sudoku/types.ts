export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export type Cell = {
  value: CellValue;
  isGiven: boolean;
  isError: boolean;
};

export type Grid = Cell[][];
