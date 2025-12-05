import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPosts } from "../../services/posts";
import PostCard from "./PostCard";

export default function PostFeed({ mine = false, onTags }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);

  const params = useMemo(
    () => ({ page, limit: 10, ...(mine ? { author_id: "me" } : {}) }),
    [page, mine]
  );

  async function load() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetchPosts(params);
      const data = res?.data?.data;
      const list = Array.isArray(data?.items) ? data.items : [];
      setItems((prev) => (page === 1 ? list : [...prev, ...list]));
      setHasMore(list.length > 0);

      // build trending tags (client-side)
      if (typeof onTags === "function") {
        const map = new Map();
        (page === 1 ? list : [...items, ...list]).forEach((p) => {
          (p.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1));
        });
        const tags = Array.from(map.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([tag, count]) => ({ tag, count }));
        onTags(tags);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "650px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-xl space-y-5">
        {items.map((p) => (
          <PostCard key={p._id} post={p} onChanged={() => setPage(1)} />
        ))}

        {!items.length && !loading && (
          <div className="text-gray-500 text-center py-6">No posts yet.</div>
        )}

        {/* skeletons */}
        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-xl h-[420px] bg-white/[0.04] border border-white/10 rounded-2xl animate-pulse"
            />
          ))}
      </div>

      <div ref={sentinel} />
    </div>
  );
}
