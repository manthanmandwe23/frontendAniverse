import { useState } from "react";
import CreatePostModal from "./CreatePost";
import PostFeed from "./PostFeed";
import TrendingTags from "./TrendingTags";
import RightTips from "./RightTips";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
const resolve = (u) =>
  !u ? "" : u.startsWith("/uploads") ? `${ORIGIN}${u}` : u;

export default function PostsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [tags, setTags] = useState([]);
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="min-h-screen pt-20 bg-[#0b0c10] text-white">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 px-2 sm:px-6 py-8">
          {/* LEFT SIDEBAR */}
          <aside className="md:col-span-3 space-y-6 md:sticky md:top-20 self-start pl-2 sm:pl-0">
            {/* User section */}
            {user && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-[#15161a] to-[#0d0e10] rounded-xl border border-white/10 p-3 shadow-[0_4px_18px_rgba(0,0,0,0.3)]">
                <img
                  src={resolve(user.avatar) || "/default-user.png"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border border-white/10 object-cover"
                />
                <div className="leading-tight">
                  <div className="font-semibold text-white text-sm truncate max-w-[120px]">
                    {user.username || user.name || "Fan"}
                  </div>
                  <div className="text-[11px] text-gray-400 capitalize">
                    {user.role || "fan"}
                  </div>
                </div>
              </div>
            )}

            {/* Intro Text */}
            <div className="pt-2">
              <h1 className="text-2xl font-extrabold leading-snug">
                Explore posts from{" "}
                <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  fans & creators
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Share your thoughts, moments, and theories from your favorite
                anime.
              </p>
            </div>

            {/* Create Post */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 text-white py-3 px-5 rounded-xl w-full font-semibold shadow-[0_10px_30px_rgba(99,102,241,.35)] transition-transform active:scale-95"
            >
              <span className="text-lg">✏️</span> Create Post
            </button>

            {/* My Posts */}
            <button
              onClick={() => navigate("/my-posts")}
              className="flex items-center justify-center gap-2 bg-[#1b1c22] hover:bg-[#25262d] text-white py-3 px-5 rounded-xl w-full font-semibold border border-white/10 transition-transform active:scale-95"
            >
              <span className="text-lg">📜</span> My Posts
            </button>

            {/* Quote / Tagline */}
            <div className="mt-8 bg-[#111215] border border-white/10 rounded-xl p-4 shadow-inner">
              <p className="text-sm text-gray-400 italic">
                “The world isn’t perfect. But it’s there for us, trying the best
                it can... that’s what makes it so damn beautiful.” <br />
                <span className="text-[11px] text-gray-500">– Roy Mustang</span>
              </p>
            </div>
          </aside>

          {/* CENTER FEED */}
          <main className="md:col-span-6 flex justify-center">
            <PostFeed onTags={setTags} />
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="md:col-span-3 space-y-6 md:sticky md:top-20 self-start">
            <TrendingTags items={tags} />
            <RightTips />
          </aside>
        </div>

        {showCreate && (
          <CreatePostModal
            onClose={() => setShowCreate(false)}
            onCreated={() => document.dispatchEvent(new Event("feed-refresh"))}
          />
        )}
      </div>
    </div>
  );
}
