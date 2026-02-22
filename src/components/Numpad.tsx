import type { CellValue } from "../sudoku/types";

interface Props {
  onInput: (value: CellValue) => void;
  disabled?: boolean;
}

export default function Numpad({ onInput, disabled = false }: Props) {
  const btnBase =
    "w-12 h-12 rounded text-lg font-semibold transition-colors duration-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";
  const numBtn = `${btnBase} bg-white border border-gray-300 text-black hover:bg-blue-50 active:bg-blue-100`;
  const delBtn = `${btnBase} bg-white border border-gray-300 text-red-500 hover:bg-red-50 active:bg-red-100 text-sm`;

  return (
    <div className="flex gap-1.5 mt-2 justify-center">
      {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onInput(n)}
          className={numBtn}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onInput(null)}
        className={delBtn}
      >
        ⌫
      </button>
    </div>
  );
}
