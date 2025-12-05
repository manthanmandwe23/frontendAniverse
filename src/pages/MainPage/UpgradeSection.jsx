import { useNavigate } from "react-router-dom";

export default function UpgradeSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 mt-20 overflow-hidden bg-[#0a0a0f]">
      {/* background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-fuchsia-500/25 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-indigo-500/25 blur-3xl animate-pulse" />
      </div>

      {/* gradient grid overlay */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white glow">
          Level Up Your Anime Experience
        </h2>

        <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base">
          Unlock creator access, premium polls, priority notifications, early
          manga drops, and a badge that actually means something.
        </p>

        {/* Cards like anime power ups */}
        <div className="grid sm:grid-cols-2 gap-8 mt-14">
          {/* Free tier */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>✔ Join communities</li>
              <li>✔ Read latest news</li>
              <li>✔ Vote in public polls</li>
            </ul>
            <button
              className="mt-6 w-full py-2 rounded-lg border border-white/10 text-white/80 text-sm"
            //   onClick={() => navigate("/upgrade")}
            >
              You're here ✓
            </button>
          </div>

          {/* Premium */}
          <div className="group rounded-2xl border border-fuchsia-500/40 p-[1px] bg-gradient-to-r from-fuchsia-500/40 via-white/10 to-indigo-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition">
            <div className="rounded-2xl bg-[#0a0a0f]/90 backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-2 text-fuchsia-300">
                Premium
              </h3>
              <ul className="text-white/80 text-sm space-y-2">
                <li>✨ Create polls</li>
                <li>✨ Creator interaction access</li>
                <li>✨ Priority notifications</li>
                <li>✨ Early manga features</li>
                <li>✨ Premium badge</li>
              </ul>
              <button
                className="mt-6 w-full py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 transition text-white font-medium shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                onClick={() => navigate("/upgrade")}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* Sneaky hype text */}
        <p className="text-xs text-white/50 mt-6">
          Become the fan studios can't ignore.
        </p>
      </div>

      {/* simple glow style */}
      <style>{`
        .glow {
          text-shadow:
            0 0 8px rgba(255,255,255,0.2),
            0 0 18px rgba(217,70,239,0.25),
            0 0 32px rgba(99,102,241,0.3);
        }
      `}</style>
    </section>
  );
}
