export default function TrendingTags({ items = [] }) {
  const topCreators = [
    { name: "Oda", anime: "One Piece", avatar: "/animeimage1.png" },
    { name: "Kishimoto", anime: "Naruto", avatar: "/animeimage2.png" },
    { name: "Gotōge", anime: "Demon Slayer", avatar: "/animeimage1.png" },
  ];

  const spotlight = {
    title: "Attack on Titan: Rebirth",
    image: "/animeimage2.png",
    desc: "Rumors hint at a 2025 OV special — fans are hyped again!",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Trending Tags */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <h3 className="text-white font-semibold mb-3">🔥 Trending Tags</h3>
        {!items.length ? (
          <div className="text-sm text-gray-400">No trending tags yet.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((t) => (
              <span
                key={t.tag}
                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-indigo-600/25 to-fuchsia-600/25 text-indigo-200 border border-white/10"
              >
                #{t.tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Top Creators */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <h3 className="text-white font-semibold mb-3">🏆 Top Creators</h3>
        <ul className="space-y-3">
          {topCreators.map((c, i) => (
            <li key={i} className="flex items-center gap-3">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
              <div>
                <div className="text-white text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-gray-400">{c.anime}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Anime Spotlight */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#141416] to-[#0d0e10] overflow-hidden shadow-lg">
        <img
          src={spotlight.image}
          alt=""
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1">
            {spotlight.title}
          </h3>
          <p className="text-sm text-gray-300">{spotlight.desc}</p>
        </div>
      </div>
    </div>
  );
}
