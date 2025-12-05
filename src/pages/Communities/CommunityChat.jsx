import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const WS_BASE = (
  import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"
).replace(/^http/, "ws");

export default function CommunityChat({ communityId }) {
  const { token, user } = useSelector((s) => s.auth);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!token || !communityId) return;
    const url = `${WS_BASE}/ws/community?community_id=${communityId}&token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const m = JSON.parse(evt.data);
        if (m.type === "message") {
          setMsgs((prev) => [...prev, m].slice(-200));
        }
      } catch (_) {}
    };
    ws.onclose = () => {
      wsRef.current = null;
    };
    return () => ws.close();
  }, [token, communityId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  function send() {
    const body = text.trim();
    if (!body || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", body }));
    setText("");
  }

  return (
    <div className="h-[520px] bg-white/[0.03] border border-white/10 rounded-xl flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 text-white/90 font-semibold">
        Community Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className="flex items-start gap-3">
            <img
              src={m.sender_avatar || "/default-user.png"}
              className="w-9 h-9 rounded-full object-cover border border-white/10"
            />
            <div>
              <div className="text-sm text-white font-semibold">
                {m.sender_name || "User"}
              </div>
              <div className="text-sm text-white/85 bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                {m.body}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          className="flex-1 bg-black/40 text-white px-3 py-2 rounded-lg outline-none border border-white/10"
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
