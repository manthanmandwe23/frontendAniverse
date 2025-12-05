// import React, { useEffect, useState } from "react";
// // import { getPosts, toggleLike } from "../services/posts";
// import { useSelector } from "react-redux";
// import { getPosts } from "../../services/auth";

// export default function Posts() {
//   const { user } = useSelector((s) => s.auth);
//   const [posts, setPosts] = useState([]);

//   const ASSET_BASE =
//     import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
//   const resolveImage = (u) =>
//     u?.startsWith("/uploads") ? `${ASSET_BASE}${u}` : u;

//   useEffect(() => {
//     load();
//   }, []);

//   async function load() {
//     const res = await getPosts();
//     setPosts(res.data.data.items);
//   }

//   const handleLike = async (id) => {
//     await toggleLike(id);
//     load();
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-6 space-y-6 pb-20">
//       {posts.map((p) => (
//         <div
//           key={p._id}
//           className="bg-black/50 border border-gray-700 rounded-xl p-4"
//         >
//           {/* User */}
//           <div className="flex items-center gap-3 mb-2">
//             <img
//               src={resolveImage(p.author?.avatar) || "/default-avatar.png"}
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <div>
//               <p className="text-white font-semibold">
//                 {p.authorName || "User"}
//               </p>
//               <p className="text-xs text-gray-400">
//                 {new Date(p.created_at).toDateString()}
//               </p>
//             </div>
//           </div>

//           {/* Post Body */}
//           <p className="text-gray-200 mb-2">{p.body}</p>

//           {/* Image */}
//           {p.media?.length > 0 && (
//             <img
//               src={resolveImage(p.media[0].url)}
//               className="w-full rounded-lg object-cover max-h-80"
//             />
//           )}

//           {/* Actions */}
//           <div className="flex gap-6 text-gray-300 mt-3 text-sm">
//             <button onClick={() => handleLike(p._id)}>
//               ❤️ {p.like_count || 0}
//             </button>
//             <button>💬 {p.comment_count || 0}</button>
//             <button>↗ Share</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
