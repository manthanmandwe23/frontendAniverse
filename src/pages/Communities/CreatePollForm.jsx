// src/pages/Communities/CreatePollForm.jsx
import React, { useState } from "react";
import api from "../../lib/api";

export default function CreatePollForm({ communityId, onDone }) {
  const [question, setQuestion] = useState("");
  const [opts, setOpts] = useState(["", ""]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function updateOpt(i, v) {
    setOpts((prev) => prev.map((o, idx) => (idx === i ? v : o)));
  }
  function addOpt() {
    setOpts((prev) => [...prev, ""]);
  }
  function removeOpt(i) {
    setOpts((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit() {
    const clean = opts.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || clean.length < 2)
      return setErr("Need a question and at least 2 options");
    setBusy(true);
    setErr("");
    try {
      await api.post("/api/polls", {
        question: question.trim(),
        options: clean,
        scope: "community",
        scopeId: communityId,
      });
      onDone();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create poll");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {err && <div className="text-red-400 text-sm mb-2">{err}</div>}

      <input
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none text-white"
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="mt-3 space-y-2">
        {opts.map((o, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none text-white"
              placeholder={`Option ${i + 1}`}
              value={o}
              onChange={(e) => updateOpt(i, e.target.value)}
            />
            {opts.length > 2 && (
              <button
                onClick={() => removeOpt(i)}
                className="px-2 rounded-lg border border-white/10 text-white/60 hover:text-white"
              >
                −
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addOpt}
          className="text-sm text-white/70 hover:text-white mt-1"
        >
          + Add option
        </button>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onDone}
          className="px-4 py-2 rounded-lg border border-white/10"
        >
          Cancel
        </button>
        <button
          disabled={busy}
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create Poll"}
        </button>
      </div>
    </div>
  );
}
