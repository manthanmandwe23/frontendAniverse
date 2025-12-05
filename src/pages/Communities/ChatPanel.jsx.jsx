import React, { useEffect, useRef, useState } from "react";
import { formatTime } from "./utils";
import Modal from "./Modal";
import CreateCommunityPost from "./CreateCommunityPost";
import CreatePollForm from "./CreatePollForm";

const WS_BASE = (
  import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"
).replace(/^http/, "ws");

export default function ChatPanel({ community, canPost, token, me }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!community?._id || !token) return;

    const id = community._id || community.id;

    // 1️⃣ Load last 50 messages before opening socket
    fetch(
      `${
        import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"
      }/api/communities/${id}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((r) => r.json())
      .then((res) => {
        const data = res?.data || [];
        setMsgs(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.warn("msg fetch err", err));

    // 2️⃣ Open WebSocket
    const ws = new WebSocket(
      `${WS_BASE}/ws/community?community_id=${id}&token=${token}`
    );
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const m = JSON.parse(evt.data);
        if (m.type === "message") setMsgs((prev) => [...prev, m].slice(-300));
      } catch (_) {}
    };

    ws.onerror = (e) => console.warn("WS error", e);
    ws.onclose = () => {
      console.log("WS closed, retrying in 5s...");
      wsRef.current = null;
      setTimeout(() => {
        if (canPost) window.location.reload();
      }, 5000);
    };

    return () => ws.close();
  }, [community?._id, canPost, token]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs.length]);

  async function send() {
    const body = text.trim();
    if (!body || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", body }));
    setText("");
  }

  const [postOpen, setPostOpen] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex justify-between bg-black/30">
        <div>
          <div className="font-bold">{community?.name}</div>
          <div className="text-white/60 text-xs">
            {community?.member_count ?? community?.members?.length ?? 0} members
          </div>
        </div>

        <div className="flex gap-2">
          {!canPost && (
            <button
              onClick={() => alert("Join this community from sidebar first.")}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-sm hover:bg-emerald-500"
            >
              Join
            </button>
          )}
          {canPost && (
            <>
              <button
                onClick={() => setPostOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm"
              >
                + Post
              </button>
              <button
                onClick={() => setPollOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-sm"
              >
                + Poll
              </button>
            </>
          )}
        </div>
      </div>

      <div
        ref={listRef}
        className="h-[66vh] overflow-y-auto px-3 py-4 space-y-2"
      >
        {msgs.map((m, i) => {
          const mine =
            m.sender_id === me?._id ||
            m.SenderID === me?._id ||
            m.SenderID === me?.id;
          return (
            <div
              key={m.id || i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-black/40 border border-white/10 text-white rounded-bl-sm"
                }`}
              >
                <div>{m.body}</div>
                <div className="text-[10px] opacity-70 mt-1">
                  {formatTime(m.created_at)}
                </div>
              </div>
            </div>
          );
        })}

        {!msgs.length && (
          <div className="text-white/60 text-center py-12 text-sm">
            {canPost ? "No messages yet — say hi 👋" : "Join to view messages."}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3 bg-black/30 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={canPost ? "Message…" : "Join to chat"}
          disabled={!canPost}
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 outline-none"
        />
        <button
          onClick={send}
          disabled={!canPost}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {postOpen && (
        <Modal title="Create Post" onClose={() => setPostOpen(false)}>
          <CreateCommunityPost
            communityId={community._id}
            onDone={() => setPostOpen(false)}
          />
        </Modal>
      )}
      {pollOpen && (
        <Modal title="Create Poll" onClose={() => setPollOpen(false)}>
          <CreatePollForm
            communityId={community._id}
            onDone={() => setPollOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
