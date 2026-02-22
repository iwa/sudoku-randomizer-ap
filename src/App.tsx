import { useState } from "react";
import type { CellValue, Grid } from "./sudoku/types";
import "./App.css";
import APStatus from "./components/APStatus";
import APConnect from "./components/APConnect";
import SudokuGrid from "./components/SudokuGrid";
import MessageLog from "./components/MessageLog";
import { disconnectFromAP } from "./archipelago/client";

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
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [slotName, setSlotName] = useState("");

  const handleCellChange = (row: number, col: number, value: CellValue) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      const cell = newGrid[row][col];

      if (cell.isGiven) return prevGrid; // Don't allow changes to given cells

      cell.value = value;
      cell.isError = false; // Reset error state on change
      return newGrid;
    });
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelected([row, col]);
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
      <h1 className="text-2xl text-center font-bold italic mt-2 mb-4">
        Sudoku Rando AP
      </h1>

      <div className="flex flex-row mt-4 gap-2 px-2">
        <div className="flex-1 bg-zinc-800 flex items-center justify-center rounded p-4">
          <SudokuGrid
            grid={grid}
            onCellChange={handleCellChange}
            selected={selected}
            onCellSelect={handleCellSelect}
          />
        </div>

        <div className="flex-1 bg-zinc-800 flex flex-col rounded p-4">
          <APStatus
            isConnected={isConnected}
            slotName={slotName}
            onDisconnect={handleDisconnect}
          />
          <APConnect isConnected={isConnected} onConnected={handleConnected} />
        </div>
      </div>

      <MessageLog />
    </main>
  );
}
