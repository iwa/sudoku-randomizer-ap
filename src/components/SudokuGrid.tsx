import type { Grid } from "../sudoku/types";
import Cell from "./Cell";

interface Props {
  grid: Grid;
  onCellChange: (row: number, col: number, value: number | null) => void;
  selected: [number, number] | null;
  onCellSelect: (row: number, col: number) => void;
}

export default function SudokuGrid({
  grid,
  onCellChange,
  selected,
  onCellSelect,
}: Props) {
  return (
    <div className="grid grid-cols-9 border-2 border-black w-fit">
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            isSelected={
              selected ? selected[0] === r && selected[1] === c : false
            }
            onClick={() => onCellSelect(r, c)}
            onChange={(value) => onCellChange(r, c, value)}
          />
        )),
      )}
    </div>
  );
}
