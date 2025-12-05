// src/pages/Anime/News.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getAllAnime } from "../../services/auth";
import Header from "../../components/Header";

const LIMIT = 12;
const ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
const resolveImg = (u) =>
  !u ? "" : u.startsWith("/uploads") ? `${ORIGIN}${u}` : u;

export default function News() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [sort, setSort] = useState("-created_at");
  const [loading, setLoading] = useState(false);
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => setPageKey((k) => k + 1), [page, sort]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getAllAnime({ page, limit: LIMIT, sort });
        const data = res?.data;
        const list =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.items) && data.items) ||
          (Array.isArray(data?.data?.items) && data.data.items) ||
          (Array.isArray(data?.data) && data.data) ||
          [];
        const totalCount =
          data?.total ??
          data?.data?.total ??
          (list.length < LIMIT
            ? (page - 1) * LIMIT + list.length
            : page * LIMIT + 1);

        if (!alive) return;
        setItems(list);
        setTotal(totalCount);
      } catch (e) {
        if (!alive) return;
        console.error("getAllAnime failed:", e);
        setItems([]);
        setTotal((page - 1) * LIMIT);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, sort]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageKey]);

  return (
    <div>
      <Header/>
      <div className="min-h-screen pt-16 bg-[#0a0a0f]">
        <HeaderBar />

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6 flex flex-wrap items-center justify-between gap-3">
          <FilterPill label="All" active onClick={() => {}} />
          <SortSelect sort={sort} setSort={setSort} />
        </div>

        <section
          key={pageKey}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-[newsIn_.5s_cubic-bezier(.16,.84,.44,1)_both]"
        >
          <style>{`
          @keyframes newsIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .card {
            background: rgba(255,255,255,.035);
            border: 1px solid rgba(255,255,255,.09);
          }
          .card:hover {
            box-shadow: 0 16px 40px rgba(99,102,241,.18);
          }
          .img-wrap::after{
            content:"";
            position:absolute; inset:0;
            background: linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.0) 50%);
            pointer-events:none;
          }
        `}</style>

          {loading ? (
            <SkeletonGrid />
          ) : items.length === 0 ? (
            <div className="text-center text-white/70 py-16">No news yet.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((a, i) => (
                <UniformCard key={a._id || a.id || i} a={a} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Pager page={page} setPage={setPage} total={total} limit={LIMIT} />
          </div>
        </section>

        <div className="pb-10" />
      </div>
    </div>
  );
}

/* ---------- Top header (simple & consistent) ---------- */
function HeaderBar() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-fuchsia-600/35" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-indigo-600/35" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16">
        <h1
          className="text-center text-4xl md:text-6xl font-extrabold tracking-tight text-white"
          style={{
            textShadow:
              "0 0 10px rgba(255,255,255,.2), 0 0 28px rgba(99,102,241,.3)",
          }}
        >
          Latest Anime
        </h1>
        <p className="text-center text-white/70 mt-3">
          Fresh news & trailers. Clean grid. No clutter.
        </p>
      </div>
    </section>
  );
}

/* ---------- Controls ---------- */
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm rounded-full px-3.5 py-1.5 border transition ${
        active
          ? "bg-white/10 border-white/20 text-white"
          : "bg-black/20 border-white/10 text-white/80 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function SortSelect({ sort, setSort }) {
  return (
    <div className="text-sm text-white/80">
      <label className="mr-2 opacity-80">Sort by:</label>
      <select
        className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 outline-none"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="-created_at">Latest</option>
        <option value="created_at">Oldest</option>
        <option value="-featured">Featured</option>
      </select>
    </div>
  );
}

/* ---------- Card (uniform size) ---------- */
function UniformCard({ a }) {
  const img =
    resolveImg(a.poster || a.image || a.thumbnail || a.trailer_url) ||
    "/anime-hero-placeholder.jpg";
  const tags =
    (Array.isArray(a.tags) && a.tags) ||
    (typeof a.tags === "string" ? a.tags.split(",").map((t) => t.trim()) : []);
  return (
    <article className="card rounded-2xl overflow-hidden transition">
      {/* fixed aspect for EVERY card */}
      <div className="relative img-wrap w-full aspect-[16/10] overflow-hidden">
        <img
          src={img}
          alt={a.title || "anime"}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.05]"
        />
        {a.featured && (
          <div className="absolute top-3 left-3 text-[11px] uppercase tracking-wider px-2 py-1 rounded-md bg-fuchsia-600/70 border border-fuchsia-300/30">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg line-clamp-1">
          {a.title || "Untitled"}
        </h3>
        <p className="text-white/75 text-sm mt-1 line-clamp-3">
          {a.synopsis || a.tagline || "—"}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((t, i) => (
            <span
              key={i}
              className="text-[11px] uppercase tracking-wide rounded-md px-2 py-1 bg-black/30 border border-white/10 text-white/80"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          {a.trailer_url ? (
            <a
              href={a.trailer_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-300 hover:text-white"
            >
              ▶ Trailer
            </a>
          ) : (
            <span />
          )}
          <button className="text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-white/85">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Skeletons ---------- */
function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: LIMIT }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10"
        >
          <div className="w-full aspect-[16/10] bg-white/5 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Pager (unchanged behavior) ---------- */
function Pager({ page, setPage, total, limit = 12 }) {
  const totalPages = useMemo(() => {
    if (!total || total <= 0) return page;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit, page]);

  const pages = useMemo(() => {
    const window = 1;
    const out = [];
    const start = Math.max(1, page - window);
    const end = Math.min(totalPages, page + window);
    for (let p = start; p <= end; p++) out.push(p);
    if (!out.includes(1)) out.unshift(1);
    if (!out.includes(totalPages)) out.push(totalPages);
    return Array.from(new Set(out)).sort((a, b) => a - b);
  }, [page, totalPages]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-2 py-1">
      <button
        onClick={() => canPrev && setPage(page - 1)}
        disabled={!canPrev}
        className={`px-3 py-1.5 rounded-lg text-sm ${
          canPrev
            ? "text-white/90 hover:bg-white/10"
            : "text-white/40 cursor-not-allowed"
        }`}
      >
        Prev
      </button>

      {pages.map((p, idx) => {
        const showDots =
          idx > 0 &&
          pages[idx] - pages[idx - 1] > 1 &&
          pages[idx] !== totalPages &&
          pages[idx - 1] !== 1;
        return (
          <React.Fragment key={p}>
            {showDots && (
              <span className="px-2 text-white/40 select-none">…</span>
            )}
            <button
              onClick={() => setPage(p)}
              className={`min-w-[36px] h-9 px-3 rounded-lg text-sm transition ${
                p === page
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,.35)]"
                  : "text-white/85 hover:bg-white/10"
              }`}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => canNext && setPage(page + 1)}
        disabled={!canNext}
        className={`px-3 py-1.5 rounded-lg text-sm ${
          canNext
            ? "text-white/90 hover:bg-white/10"
            : "text-white/40 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
