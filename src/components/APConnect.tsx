import { useState } from "react";
import { connectToAP } from "../archipelago/client";

interface Props {
  isConnected: boolean;
  onConnected: (slotName: string) => void;
}

export default function APConnect({ isConnected, onConnected }: Props) {
  const [server, setServer] = useState("localhost:38281");
  const [slot, setSlot] = useState("Player");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    try {
      await connectToAP(server, slot, password);
      onConnected(slot);
    } catch (err) {
      setError(`Failed to connect: ${err}`);
    }
  };

  return (
    <div className={isConnected ? "opacity-50 pointer-events-none" : ""}>
      <input
        type="text"
        placeholder="Server"
        value={server}
        onChange={(e) => setServer(e.target.value)}
        disabled={isConnected}
        className="border border-zinc-600 bg-zinc-700 text-white rounded p-1 mb-2 w-full disabled:opacity-50"
      />
      <input
        type="text"
        placeholder="Slot Name"
        value={slot}
        onChange={(e) => setSlot(e.target.value)}
        disabled={isConnected}
        className="border border-zinc-600 bg-zinc-700 text-white rounded p-1 mb-2 w-full disabled:opacity-50"
      />
      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isConnected}
        className="border border-zinc-600 bg-zinc-700 text-white rounded p-1 mb-2 w-full disabled:opacity-50"
      />
      <button
        type="button"
        onClick={handleConnect}
        disabled={isConnected}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Connect to AP
      </button>
      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
    </div>
  );
}
