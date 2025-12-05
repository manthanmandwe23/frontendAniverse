import React, { useEffect, useRef } from "react";

export default function HomeHero() {
  const ref = useRef(null);

  // simple scroll-reveal (no libs)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("reveal-in"),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0a0a0f] text-white py-16 md:py-24"
    >
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-fuchsia-600/40 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-indigo-600/40 animate-pulse" />

      {/* local styles for glow + shimmer */}
      <style>{`
        .glow {
          text-shadow:
            0 0 8px rgba(255, 115, 179, .35),
            0 0 22px rgba(99, 102, 241, .35);
        }
        .shine {
          background: linear-gradient(90deg, #fff, #b3b3ff, #fff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 5s linear infinite;
          background-size: 200%;
        }
        @keyframes shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .float-in {
          opacity: 0;
          transform: translateY(16px) scale(.98);
          filter: blur(6px);
          transition: opacity .7s cubic-bezier(.16,.84,.44,1),
                      transform .7s cubic-bezier(.16,.84,.44,1),
                      filter .7s cubic-bezier(.16,.84,.44,1);
        }
        .reveal-in .float-in { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        .fade-stagger > * { opacity: 0; transform: translateY(10px); transition: all .6s ease; }
        .reveal-in .fade-stagger > * { opacity: 1; transform: translateY(0); }
        .reveal-in .fade-stagger > *:nth-child(1){ transition-delay:.06s }
        .reveal-in .fade-stagger > *:nth-child(2){ transition-delay:.12s }
        .reveal-in .fade-stagger > *:nth-child(3){ transition-delay:.18s }
        .reveal-in .fade-stagger > *:nth-child(4){ transition-delay:.24s }
        .reveal-in .fade-stagger > *:nth-child(5){ transition-delay:.30s }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="float-in inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/70 mb-4">
          <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
          Building the home for anime fandom
        </div>

        {/* Big heading */}
        <h1 className="float-in text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight glow">
          The place where <span className="shine">fans meet creators</span> and{" "}
          <span className="shine">ideas become seasons.</span>
        </h1>

        {/* Subtext */}
        <p className="float-in max-w-3xl mt-5 text-base md:text-lg text-white/80">
          News that actually reaches fans, polls that actually matter, and a
          marketplace that actually supports artists. One platform to track
          releases, rally communities, and signal real demand to studios.
        </p>

        {/* CTA row */}
        <div className="float-in mt-7 flex flex-wrap items-center gap-3">
          <button className="px-5 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 transition shadow-[0_10px_30px_rgba(217,70,239,.35)]">
            Start a community
          </button>
          <button className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10 transition">
            See upcoming releases
          </button>
          <span className="text-sm text-white/60">Free to join</span>
        </div>

        {/* Content grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 fade-stagger">
          {/* Left: What it is */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              What we’re building
            </h2>
            <p className="text-white/80">
              A full-stack hub for anime lovers: create topic-based communities
              (One Piece, JJK, Bleach), post news and trailers, and run{" "}
              <span className="font-semibold text-white">polls</span> that help
              creators gauge demand for sequels and re-releases.
            </p>
            <ul className="mt-5 space-y-3">
              <Feature>Realtime news & trailer drops</Feature>
              <Feature>Community polls with anti-spam voting</Feature>
              <Feature>Creator pages & AMA sessions</Feature>
              <Feature>Manga store for official releases</Feature>
              <Feature>Personalized feeds & notifications</Feature>
            </ul>
          </div>

          {/* Right: Why it matters */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              Why it matters
            </h2>
            <p className="text-white/80">
              Fans often miss dates, trailers, and renewal news. Studios need
              clearer signals than scattered comments. We connect both sides
              with transparent metrics from verified polls and community
              momentum.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat k="Communities" v="100+" />
              <Stat k="Votes cast" v="250k" />
              <Stat k="Creators onboard" v="40+" />
            </div>
            <div className="mt-6 text-white/70 text-sm">
              Example: fans of <span className="text-white">Beelzebub</span> can
              rally requests for a continuation and share it directly with
              studios, backed by real numbers.
            </div>
          </div>
        </div>

        {/* How it works steps */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 fade-stagger">
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            How it works
          </h3>
          <ol className="grid sm:grid-cols-3 gap-6">
            <Step n="1" t="Create or join a community">
              Follow your favorite anime and invite friends.
            </Step>
            <Step n="2" t="Post updates & launch polls">
              Vote on new seasons, dubs, re-releases, and more.
            </Step>
            <Step n="3" t="Share signals with creators">
              Aggregated demand data helps studios make decisions.
            </Step>
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------- tiny subcomponents ------- */
function Feature({ children }) {
  return (
    <li className="flex items-start gap-3">
      <svg
        className="mt-1 h-5 w-5 flex-none"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      <span className="text-white/85">{children}</span>
    </li>
  );
}

function Stat({ k, v }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center">
      <div className="text-2xl font-bold">{v}</div>
      <div className="text-xs uppercase tracking-wider text-white/60 mt-1">
        {k}
      </div>
    </div>
  );
}

function Step({ n, t, children }) {
  return (
    <li className="group rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-fuchsia-600/30 border border-fuchsia-400/30 flex items-center justify-center font-bold">
          {n}
        </div>
        <div className="font-semibold">{t}</div>
      </div>
      <p className="mt-2 text-sm text-white/75">{children}</p>
    </li>
  );
}
