import { useState } from "react";
import { useSelector } from "react-redux";
import { toggleLikePost, deletePost } from "../../services/posts";
import CommentsDrawer from "./Comment/CommentDrawer";

const ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
const resolve = (u) =>
  !u ? "" : u.startsWith("/uploads") ? `${ORIGIN}${u}` : u;

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostCard({ post, onChanged }) {
  const { user } = useSelector((s) => s.auth);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.like_count || 0);
  const [openComments, setOpenComments] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [glow, setGlow] = useState(false);

  const isOwner = user?._id === post.author_id;

  const handleLike = async () => {
    try {
      const res = await toggleLikePost(post._id);
      const newLiked = !!res.data?.data?.liked;
      setLiked(newLiked);
      setLikes((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));

      // glow effect on like
      setGlow(true);
      setTimeout(() => setGlow(false), 500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deletePost(post._id);
    setDeleting(false);
    onChanged?.();
  };

  return (
    <article
      className={`relative overflow-hidden transition-all duration-500 bg-gradient-to-b from-[#111214] to-[#0d0e10] border border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
        glow ? "animate-glow" : ""
      }`}
    >
      {/* Glow overlay */}
      {glow && (
        <div className="absolute inset-0 bg-pink-500/20 blur-xl animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-white/5">
        <img
          src={resolve(post.author_avatar) || "/default-user.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-white/10"
        />
        <div className="flex-1">
          <div className="text-white font-semibold text-sm truncate">
            {post.author_name}
          </div>
          <div className="text-xs text-gray-400">
            {timeAgo(post.created_at)}
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
          >
            {deleting ? "..." : "✖"}
          </button>
        )}
      </div>

      {/* Image */}
      {post.media?.length > 0 && (
        <div className="overflow-hidden relative">
          <img
            src={resolve(post.media[0].url)}
            className="max-h-[360px] w-full object-contain md:object-cover hover:scale-105 transition-transform duration-[800ms]"
          />
        </div>
      )}

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-gray-200 text-[15px] leading-relaxed">{post.body}</p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full bg-gradient-to-r from-indigo-700/30 to-fuchsia-700/30 text-indigo-200 text-xs border border-white/10"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm ${
            liked ? "text-pink-400" : "text-gray-400 hover:text-pink-300"
          }`}
        >
          ❤️ <span>{likes}</span>
        </button>

        <button
          onClick={() => setOpenComments(true)}
          className="flex items-center gap-1 text-gray-400 hover:text-sky-300 text-sm"
        >
          💬 {post.comment_count || 0}
        </button>

        <button className="text-gray-400 hover:text-violet-300 text-sm">
          ↗ Share
        </button>
      </div>

      {openComments && (
        <CommentsDrawer
          postId={post._id}
          onClose={() => setOpenComments(false)}
        />
      )}
    </article>
  );
}
