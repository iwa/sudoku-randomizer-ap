import type { CellValue } from "../sudoku/types";

interface Props {
  onInput: (value: CellValue) => void;
  disabled?: boolean;
  disabledNumpadButtons: number[];
}

export default function Numpad({
  onInput,
  disabled = false,
  disabledNumpadButtons,
}: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const btnBase =
    "w-12 h-12 rounded text-lg font-semibold transition-[box-shadow,translate] duration-200 cursor-pointer bg-zinc-800 border border-zinc-700 shadow-numpad-button active:shadow-none active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-40";
  const numBtn = `${btnBase} text-white hover:bg-white/3 active:bg-white/10`;
  const delBtn = `${btnBase} text-red-500 hover:bg-red-900/10 active:bg-red-900/30 text-sm`;

  return (
    <div className="flex gap-1.5 mt-2 justify-center">
      {numbers.map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled || disabledNumpadButtons.includes(n)}
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
