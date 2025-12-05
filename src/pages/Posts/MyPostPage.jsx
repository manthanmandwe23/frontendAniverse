import { useEffect, useState } from "react";
import { fetchPosts, deletePost } from "../../services/posts";
import { useSelector } from "react-redux";
import Header from "../../components/Header";

const ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
const resolve = (u) =>
  !u ? "" : u.startsWith("/uploads") ? `${ORIGIN}${u}` : u;

export default function MyPostsPage() {
  const { user } = useSelector((s) => s.auth);
  const [posts, setPosts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetchPosts({ author_id: "me", limit: 50 });
    setPosts(res.data?.data?.items || []);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await deletePost(deleteId);
      setDeleteId(null);
      load(); // reload posts
    } catch (e) {
      console.log("Delete failed", e);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <Header/>
      <div className="min-h-screen pt-32 bg-[#0b0c10] text-white px-6 py-10 flex justify-center">
        <div className="w-full max-w-[1100px]">
          <h1 className="text-3xl font-bold mb-6">My Posts</h1>

          <div className="flex items-center gap-4 mb-8">
            <img
              src={resolve(user?.avatar) || "/default-user.png"}
              className="w-16 h-16 rounded-full object-cover border border-gray-700"
            />
            <div>
              <p className="text-xl text-white font-semibold">
                {user?.username}
              </p>
              <p className="text-gray-400 text-lg">{user?.email}</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              You haven't posted anything yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {posts.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#16171d] border border-white/10 rounded-xl p-3"
                >
                  {p.media?.length > 0 && (
                    <div className="w-full h-48 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={resolve(p.media[0].url)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="text-gray-200 text-sm line-clamp-3 mt-2">
                    {p.body}
                  </p>

                  <button
                    className="text-xs bg-red-500 px-2 py-1 rounded mt-2"
                    onClick={() => setDeleteId(p._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* delete modal */}
        enter
        {deleteId && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#16171d] border border-white/10 p-6 rounded-lg w-[300px] text-center text-white">
              <h3 className="text-lg font-semibold mb-3">Delete Post?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to delete this post?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>

                <button
                  disabled={deleting}
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
