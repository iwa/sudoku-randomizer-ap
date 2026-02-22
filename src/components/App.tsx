import { useState } from "react";
import type { CellValue, Difficulty, Grid, Solution } from "../sudoku/types";
import APStatus from "./APStatus";
import APConnect from "./APConnect";
import APLocationProgress from "./APLocationProgress";
import DifficultySelector from "./DifficultySelector";
import SudokuGrid from "./SudokuGrid";
import Numpad from "./Numpad";
import MessageLog from "./MessageLog";
import {
  disconnectFromAP,
  sendLocationCheck,
  apClient,
} from "../archipelago/client";
import { generateGrid } from "../sudoku/generator";
import {
  doesGridContainsUserInput,
  isGridComplete,
  isGridValid,
  validateGrid,
} from "../sudoku/validator";
import { useLocationProgress } from "../hooks/useLocationProgress";
import Lives from "./Lives";

function createEmptyGrid(): Grid {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: null,
      isGiven: false,
      isError: false,
    })),
  );
}

export default function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [solution, setSolution] = useState<Solution | null>(null);
  const [lives, setLives] = useState<number | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [slotName, setSlotName] = useState("");
  const { checked, total } = useLocationProgress(isConnected);
  const hasLocationsRemaining = isConnected && checked < total;

  const gridLocked = lives === 0;

  const handleCellChange = (row: number, col: number, value: CellValue) => {
    if (gridLocked) return;

    const cell = grid[row][col];
    if (cell.isGiven) return;

    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    newGrid[row][col] = { ...newGrid[row][col], value };

    const validated = solution ? validateGrid(newGrid, solution) : newGrid;

    // Deduct a life when placing a wrong number (not on deletion)
    if (value !== null && validated[row][col].isError) {
      setLives((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
    }

    setGrid(validated);
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelected([row, col]);
  };

  const handleNumpadInput = (value: CellValue) => {
    if (selected === null || gridLocked) return;
    handleCellChange(selected[0], selected[1], value);
  };

  const handleGenerate = (difficulty: Difficulty) => {
    if (doesGridContainsUserInput(grid) && !gridLocked) {
      if (!confirm("Are you sure you want to generate a new grid?")) return;
    }

    const result = generateGrid(difficulty);
    setGrid(result.grid);
    setSolution(result.solution);
    setLives(3);
    setSelected(null);
  };

  const gridComplete = isGridComplete(grid);
  const gridValid =
    gridComplete && solution !== null && isGridValid(grid, solution);

  const handleCheck = () => {
    if (!gridValid) return;

    const nextLocation = apClient.room.missingLocations[0];
    if (nextLocation !== undefined) {
      sendLocationCheck(nextLocation);
    }

    setGrid(createEmptyGrid());
    setSolution(null);
    setLives(null);
    setSelected(null);
  };

  const handleConnected = (slot: string) => {
    setIsConnected(true);
    setSlotName(slot);
  };

  const handleDisconnect = () => {
    disconnectFromAP();
    setIsConnected(false);
    setSlotName("");
  };

  return (
    <main>
      <h1 className="text-2xl text-center font-bold italic text-white pt-4 pb-5">
        Sudoku Rando AP
      </h1>

      <div className="flex flex-row gap-2 px-2">
        <div className="flex-1 bg-zinc-800 flex flex-col items-center justify-center rounded gap-2 p-4">
          <Lives lives={lives} gridLocked={gridLocked} />
          <SudokuGrid
            grid={grid}
            onCellChange={gridLocked ? () => {} : handleCellChange}
            selected={selected}
            onCellSelect={handleCellSelect}
          />
          <Numpad
            onInput={handleNumpadInput}
            disabled={
              gridLocked ||
              selected === null ||
              grid[selected[0]][selected[1]].isGiven
            }
          />
        </div>

        <div className="flex-1 bg-zinc-800 flex flex-col rounded p-4">
          <APStatus
            isConnected={isConnected}
            slotName={slotName}
            onDisconnect={handleDisconnect}
          />
          <APConnect isConnected={isConnected} onConnected={handleConnected} />
          <APLocationProgress checked={checked} total={total} />
          {hasLocationsRemaining && (
            <DifficultySelector onGenerate={handleGenerate} />
          )}
          {hasLocationsRemaining && gridComplete && (
            <button
              type="button"
              onClick={handleCheck}
              disabled={!gridValid}
              className={`mt-3 w-full rounded px-4 py-2 text-sm font-medium transition-colors ${
                gridValid
                  ? "bg-green-600 text-white cursor-pointer hover:bg-green-700"
                  : "bg-zinc-600 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {gridValid ? "✓ Submit Solution" : "✗ Grid has errors"}
            </button>
          )}
        </div>
      </div>

      <MessageLog />
    </main>
  );
}
