// src/components/LatestNews.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAnime } from "../../services/auth";

const placeholder = "/anime-hero-placeholder.jpg";

export default function LatestNews() {
  const [items, setItems] = useState(null);
  const [start, setStart] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getAllAnime({ limit: 6, sort: "-created_at" });
        const r = res?.data;

        const arr =
          (Array.isArray(r) && r) ||
          (Array.isArray(r?.data) && r.data) ||
          (Array.isArray(r?.items) && r.items) ||
          (Array.isArray(r?.data?.items) && r.data.items) ||
          [];

        if (alive) setItems(arr);
      } catch (e) {
        console.error("getAllAnime failed:", e);
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!items || items.length <= 2) return;
    const id = setInterval(() => {
      setStart((s) => (s + 2) % items.length);
    }, 6000);
    return () => clearInterval(id);
  }, [items]);

  const ASSET_BASE =
    import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";

  function resolveImage(u) {
    if (!u) return "";
    return u.startsWith("/uploads") ? `${ASSET_BASE}${u}` : u;
  }

  const visible = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (items.length <= 2) return items.slice(0, 2);
    const a = items[start % items.length];
    const b = items[(start + 1) % items.length];
    return [a, b];
  }, [items, start]);

  return (
    <section className="relative mt-10 mb-16">
      {/* THEME: shared neon vibe */}
      <style>{`
        /* soft grid background + glow blobs to match VisionSection */
        .news-surface::before {
          content: "";
          position: absolute; inset: 0;
          background:
            radial-gradient(60rem 30rem at -10% -10%, rgba(217,70,239,.12), transparent 60%),
            radial-gradient(60rem 30rem at 110% 110%, rgba(99,102,241,.12), transparent 60%),
            linear-gradient(transparent 39px, rgba(255,255,255,.04) 40px),
            linear-gradient(90deg, transparent 39px, rgba(255,255,255,.04) 40px);
          background-size: auto, auto, 40px 40px, 40px 40px;
          pointer-events: none;
        }
        .glow { text-shadow:
          0 0 8px rgba(255,255,255,.15),
          0 0 18px rgba(217,70,239,.25),
          0 0 26px rgba(99,102,241,.25);
        }
        .shine {
          background: linear-gradient(90deg,#fff,#c7a6ff,#fff);
          -webkit-background-clip:text; background-clip:text; color:transparent;
          background-size:200% 100%; animation: shine 5s linear infinite;
        }
        @keyframes shine { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }

        /* stronger enters */
        @keyframes latestNewsContainerIn {
          0% { opacity: 0; transform: translateY(18px) scale(.97); filter: blur(8px); }
          60% { opacity: .95; transform: translateY(2px) scale(1); filter: blur(1.5px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes latestNewsCardIn {
          0% { opacity: 0; transform: translateY(20px) scale(.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .latest-news-fade {
          animation: latestNewsContainerIn 900ms cubic-bezier(.16,.84,.44,1);
          will-change: opacity, transform, filter;
        }
        .latest-news-card { animation: latestNewsCardIn 650ms cubic-bezier(.16,.84,.44,1) both; }
        /* gradient border helper */
        .neon-wrap {
          background: linear-gradient(135deg, rgba(217,70,239,.45), rgba(255,255,255,.08), rgba(99,102,241,.45));
          padding: 1px;
          border-radius: 1rem;
        }
        .neon-wrap:hover { filter: drop-shadow(0 6px 24px rgba(167,139,250,.25)); }
      `}</style>

      {/* background surface */}
      <div className="news-surface absolute inset-0" />

      <div className="relative max-w-6xl mx-auto px-3">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold glow">
              Latest <span className="shine">News & Trailers</span>
            </h2>
            <p className="text-white/70 text-sm mt-1">
              Fresh drops from your followed communities.
            </p>
          </div>
          <button
            onClick={() => navigate("/anime")}
            className="px-4 py-2 rounded-xl border border-white/15 text-sm text-white hover:bg-white/10 transition"
          >
            Watch all news
          </button>
        </div>

        {items === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white/5 h-64 md:h-72 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-gray-400">No anime yet.</div>
        ) : (
          <div
            key={start}
            className="latest-news-fade grid grid-cols-1 sm:grid-cols-2 gap-7"
          >
            {visible.map((a, i) => {
              const cover = resolveImage(
                a.poster ||
                  a.image ||
                  a.thumbnail ||
                  a.trailer_url ||
                  placeholder
              );
              return (
                <div
                  key={a._id || a.id || i}
                  className=" bg-[#0a0a0f]/40 rounded-4xl"
                >
                  <article
                    className="latest-news-card group rounded-2xl overflow-hidden bg-transparent backdrop-blur-sm border border-white/10 transition"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="relative w-full h-64 md:h-72 lg:h-80 overflow-hidden">
                      <img
                        src={cover}
                        alt={a.title || "anime"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      {/* top-left badge */}
                      <div className="absolute top-3 left-3 text-[11px] uppercase tracking-wider px-2 py-1 rounded-md bg-fuchsia-600/70 border border-fuchsia-300/30">
                        New
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg line-clamp-1 glow">
                        {a.title || "Untitled"}
                      </h3>
                      <p className="text-white/75 text-sm mt-1 line-clamp-2">
                        {a.synopsis || a.tagline || "—"}
                      </p>

                      {/* subtle divider with shimmer */}
                      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                        <span>Community update</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          live
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
