import { useEffect, useRef, useState } from "react";
import { apClient } from "../archipelago/client";

export default function MessageLog() {
  const [messages, setMessages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMessage = (text: string) => {
      setMessages((prev) => [...prev, text]);
    };

    apClient.messages.on("message", onMessage);

    return () => {
      apClient.messages.off("message", onMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="bg-zinc-800 rounded p-3 mx-2 mt-2">
      <h2 className="text-sm font-semibold text-zinc-400 mb-1">Server Log</h2>
      <div className="h-48 overflow-y-auto bg-zinc-950 rounded p-2 font-mono text-sm leading-6 text-zinc-300">
        {messages.length === 0 ? (
          <p className="text-zinc-600 italic">No messages yet.</p>
        ) : (
          messages.map((msg, i) => (
            <p key={i} className="wrap-break-word">
              {msg}
            </p>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
