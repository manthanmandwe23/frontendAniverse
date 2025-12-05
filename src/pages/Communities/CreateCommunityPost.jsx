// src/pages/Communities/CreateCommunityPost.jsx
import React, { useState } from "react";
import api from "../../lib/api";

export default function CreateCommunityPost({ communityId, onDone }) {
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    if (!body.trim()) return setErr("Write something");
    setBusy(true);
    try {
      await api.post("/posts", {
        body: body.trim(),
        tags: tags.split(",").map((t) => t.trim()),
        scope: "community",
        scopeId: communityId,
      });
      onDone();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {err && <div className="text-red-400 text-sm mb-2">{err}</div>}
      <textarea
        className="w-full h-28 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none text-white"
        placeholder="Share something…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        className="w-full mt-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none text-white"
        placeholder="tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onDone}
          className="px-4 py-2 border border-white/10 rounded-lg"
        >
          Cancel
        </button>
        <button
          disabled={busy}
          onClick={submit}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
