import type { Cell as CellType } from "../sudoku/types";

interface Props {
  cell: CellType;
  isSelected: boolean;
  onClick: () => void;
  onChange: (value: number | null) => void;
}

export default function Cell({ cell, isSelected, onClick, onChange }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (cell.isGiven) return; // Don't allow changes to given cells

    if (e.key >= "1" && e.key <= "9") {
      onChange(parseInt(e.key, 10));
    } else if (e.key === "Backspace" || e.key === "Delete") {
      onChange(null);
    }
  };

  const bg = isSelected
    ? "bg-blue-200"
    : cell.isError
      ? "bg-red-200"
      : "bg-white";
  const textColor = cell.isGiven ? "text-black" : "text-blue-800";

  return (
    <div
      role="gridcell"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`
        w-12 h-12 flex items-center justify-center border border-gray-300 cursor-pointer select-none text-xl outline-none ${bg} ${textColor}
        `}
    >
      {cell.value ?? ""}
    </div>
  );
}
