import { useState } from "react";
import { toggleLikePost } from "../../services/posts";

export default function LikeButton({ postId, count = 0, onChange }) {
  const [liked, setLiked] = useState(false);
  const [num, setNum] = useState(count);

  async function toggle() {
    try {
      const res = await toggleLikePost(postId);
      const isLiked = !!res.data?.data?.liked;
      setLiked(isLiked);
      setNum((n) => n + (isLiked ? 1 : -1));
      onChange?.(isLiked);
    } catch (_) {}
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-gray-300 hover:text-pink-500"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span className="text-sm">{num}</span>
    </button>
  );
}
