// src/pages/Communities/CommunityHub.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
} from "../../services/communities";
import Sidebar from "./Sidebar";
// import ChatPanel from "./ChatPanel";
import { looksMember } from "./utils";
import ChatPanel from "./ChatPanel.jsx";
import Header from "../../components/Header.jsx";

export default function CommunityHub() {
  const { user, token } = useSelector((s) => s.auth);
  const myId = user?._id || user?.id || "";

  const [search, setSearch] = useState("");
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const active = useMemo(
    () => all.find((c) => (c._id || c.id) === activeId),
    [all, activeId]
  );

  async function loadCommunities(q = {}) {
    setLoading(true);
    try {
      const res = await getAllCommunities({
        page: 1,
        limit: 100,
        search: q.search || "",
      });
      const list = res?.data?.data?.items || res?.data?.items || [];
      setAll(list);
      if (!activeId && list.length) {
        const joined = list.filter((c) => looksMember(c, myId));
        setActiveId(
          (joined[0]?._id || joined[0]?.id) ?? list[0]?._id ?? list[0]?.id
        );
      }
    } catch (e) {
      console.error("getAllCommunities:", e);
      setAll([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => loadCommunities({ search }), 300);
    return () => clearTimeout(t);
  }, [search]);

  const joined = useMemo(
    () => all.filter((c) => looksMember(c, myId)),
    [all, myId]
  );
  const suggested = useMemo(
    () => all.filter((c) => !looksMember(c, myId)),
    [all, myId]
  );

  async function toggleJoin(comm) {
    const id = comm._id || comm.id;
    const isMember = looksMember(comm, myId);
    try {
      if (isMember) {
        await leaveCommunity(id);
        if (activeId === id) setActiveId(null);
      } else {
        await joinCommunity(id);
        setActiveId(id); // open it right away
      }
      await loadCommunities({ search });
    } catch (e) {
      const msg =
        e?.response?.data?.message || "Failed to join/leave community";
      alert(msg);
    }
  }

  return (
    <div>
      <Header/>
      <div className="min-h-screen pt-24 bg-[#0a0a0f] text-white">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 grid grid-cols-12 gap-3">
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <Sidebar
              loading={loading}
              search={search}
              setSearch={setSearch}
              joined={joined}
              suggested={suggested}
              activeId={activeId}
              onOpen={setActiveId}
              onJoin={toggleJoin}
            />
          </aside>

          <main className="col-span-12 md:col-span-8 lg:col-span-9">
            {active ? (
              <ChatPanel
                key={activeId}
                community={active}
                canPost={looksMember(active, myId)}
                token={token}
                me={user}
              />
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] h-[78vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">Pick a community</div>
                  <div className="text-white/60 mt-1">
                    Join one to start chatting.
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
