import type { Cell as CellType } from "../sudoku/types";

interface Props {
  cell: CellType;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
  onChange: (value: number | null) => void;
}

export default function Cell({
  cell,
  row,
  col,
  isSelected,
  onClick,
  onChange,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (cell.isGiven) return;

    if (e.key >= "1" && e.key <= "9") {
      onChange(parseInt(e.key, 10));
    } else if (e.key === "Backspace" || e.key === "Delete") {
      onChange(null);
    }
  };

  // Background color
  let bg = "bg-white";
  if (isSelected) bg = "bg-blue-100";
  else if (cell.isError && cell.isGiven) bg = "bg-red-100"; // only apply red bg on given conflict

  // Text color
  let textColor = "text-black font-bold";
  if (cell.isError && !cell.isGiven) {
    textColor = "text-red-600 font-bold";
  } else if (!cell.isGiven) {
    textColor = "text-blue-700 font-bold";
  }

  // Subgrid borders: thicker on every 3rd boundary
  const borderT =
    row % 3 === 0 ? "border-t-2 border-t-black" : "border-t border-t-gray-300";
  const borderL =
    col % 3 === 0 ? "border-l-2 border-l-black" : "border-l border-l-gray-300";
  const borderB =
    row === 8
      ? "border-b-2 border-b-black"
      : row % 3 === 2
        ? "border-b-2 border-b-black"
        : "";
  const borderR =
    col === 8
      ? "border-r-2 border-r-black"
      : col % 3 === 2
        ? "border-r-2 border-r-black"
        : "";

  return (
    <div
      role="gridcell"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`
        w-12 h-12 flex items-center justify-center
        cursor-pointer select-none text-xl outline-none
        transition-colors duration-100
        ${bg} ${textColor}
        ${borderT} ${borderL} ${borderB} ${borderR}
      `}
    >
      {cell.value ?? ""}
    </div>
  );
}
