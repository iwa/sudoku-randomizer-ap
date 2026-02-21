import { useState } from "react";
import { connectToAP } from "../archipelago/client";

export default function APConnect() {
  const [server, setServer] = useState("localhost:38281");
  const [slot, setSlot] = useState("Player");
  const [password, setPassword] = useState("");

  const handleConnect = async () => {
    await connectToAP(server, slot, password);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Server"
        value={server}
        onChange={(e) => setServer(e.target.value)}
        className="border p-1 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Slot Name"
        value={slot}
        onChange={(e) => setSlot(e.target.value)}
        className="border p-1 mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-1 mb-2 w-full"
      />
      <button
        type="button"
        onClick={handleConnect}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Connect to AP
      </button>
    </div>
  );
}
