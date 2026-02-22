interface Props {
  isConnected: boolean;
  slotName: string;
  onDisconnect: () => void;
}

export default function APStatus({
  isConnected,
  slotName,
  onDisconnect,
}: Props) {
  return (
    <div
      className={`flex items-center justify-between rounded px-3 py-2 mb-3 text-sm font-medium ${
        isConnected
          ? "bg-green-900/40 text-green-300 border border-green-700"
          : "bg-red-900/40 text-red-300 border border-red-700"
      }`}
    >
      <span>
        {isConnected ? (
          <>
            Connected{" "}
            <span className="text-white font-semibold">(Slot: {slotName})</span>
          </>
        ) : (
          "Disconnected"
        )}
      </span>

      {isConnected && (
        <button
          type="button"
          onClick={onDisconnect}
          className="ml-4 rounded bg-red-600 px-3 py-1 text-xs text-white cursor-pointer hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}
