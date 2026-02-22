import { useState } from "react";
import type { Difficulty } from "../sudoku/types";

interface Props {
  onGenerate: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ onGenerate }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  return (
    <div className="rounded border border-zinc-600 bg-zinc-700 px-3 py-2 mt-3">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase mb-2">
        Difficulty
      </h3>
      <div className="flex items-center gap-4">
        {(["easy", "normal", "hard"] as const).map((level) => (
          <label
            key={level}
            className="flex items-center gap-1.5 text-sm text-zinc-200 cursor-pointer"
          >
            <input
              type="radio"
              name="difficulty"
              value={level}
              checked={difficulty === level}
              onChange={() => setDifficulty(level)}
              className="accent-blue-500"
            />
            <span className="capitalize">{level}</span>
          </label>
        ))}
        <button
          type="button"
          onClick={() => onGenerate(difficulty)}
          className="ml-auto rounded bg-blue-500 px-4 py-1 text-sm font-medium text-white cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Generate Grid
        </button>
      </div>
    </div>
  );
}
