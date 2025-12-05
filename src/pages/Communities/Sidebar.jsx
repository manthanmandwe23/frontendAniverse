// src/pages/Communities/Sidebar.jsx
import React from "react";
import { looksMember } from "./utils";

export default function Sidebar({
  loading,
  search,
  setSearch,
  joined,
  suggested,
  activeId,
  onOpen,
  onJoin,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-black/30">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities…"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="max-h-[74vh] overflow-y-auto p-2 space-y-6">
        {loading && (
          <div className="text-white/60 text-sm px-2 pt-3">Loading…</div>
        )}

        <Section
          title="Joined"
          list={joined}
          activeId={activeId}
          onOpen={onOpen}
          onJoin={onJoin}
        />
        <Section
          title="Suggested"
          list={suggested}
          activeId={activeId}
          onOpen={onOpen}
          onJoin={onJoin}
          showJoin
        />
      </div>
    </div>
  );
}

function Section({ title, list, activeId, onOpen, onJoin, showJoin }) {
  return (
    <section>
      <div className="px-2 text-xs uppercase tracking-wider text-white/50 mb-2">
        {title}
      </div>
      <div className="space-y-1">
        {list.length ? (
          list.map((c) => (
            <Row
              key={c._id || c.id}
              c={c}
              active={activeId === (c._id || c.id)}
              onOpen={onOpen}
              onJoin={onJoin}
              showJoin={showJoin}
            />
          ))
        ) : (
          <div className="text-white/40 text-sm px-2 py-3">
            No {title.toLowerCase()} communities.
          </div>
        )}
      </div>
    </section>
  );
}

function Row({ c, active, onOpen, onJoin, showJoin }) {
  return (
    <div
      onClick={() => onOpen(c._id || c.id)}
      className={`cursor-pointer rounded-lg px-3 py-2.5 border ${
        active
          ? "border-indigo-500/40 bg-indigo-600/10"
          : "border-white/5 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold truncate">{c.name}</div>
          <div className="text-white/60 text-xs truncate">{c.description}</div>
          <div className="text-[11px] text-white/40">
            {c.member_count ?? 0} members
          </div>
        </div>
        {showJoin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoin(c);
            }}
            className="px-2.5 py-1 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-500"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
}
