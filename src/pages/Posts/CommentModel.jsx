// import { useEffect, useState } from "react";
// import {
//   listComments,
//   createComment,
//   updateComment,
//   deleteComment,
//   toggleLikeComment,
// } from "../../services/posts";

// function CommentItem({ c, onLike, onEdit, onDelete }) {
//   return (
//     <div className="flex gap-3 py-3">
//       <div className="w-8 h-8 rounded-full bg-gray-600" />
//       <div className="flex-1">
//         <div className="text-sm text-white">{c.author_name || "User"}</div>
//         <div className="text-gray-300 text-sm">{c.body}</div>
//         <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
//           <button onClick={() => onLike(c)} className="hover:text-pink-500">
//             ❤️ {c.like_count || 0}
//           </button>
//           <button onClick={() => onEdit(c)} className="hover:text-sky-400">
//             Edit
//           </button>
//           <button onClick={() => onDelete(c)} className="hover:text-red-400">
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CommentsModal({ postId, onClose }) {
//   const [items, setItems] = useState([]);
//   const [text, setText] = useState("");
//   const [editing, setEditing] = useState(null);

//   async function load() {
//     const res = await listComments(postId, { limit: 30 });
//     setItems(res.data?.data?.items || []);
//   }

//   useEffect(() => {
//     load();
//   }, [postId]);

//   async function submit() {
//     if (!text.trim()) return;
//     if (editing) {
//       await updateComment(editing._id, text.trim());
//       setEditing(null);
//     } else {
//       await createComment(postId, text.trim());
//     }
//     setText("");
//     await load();
//   }

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl bg-[#111315] border border-white/10 rounded-xl p-4">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="text-white font-semibold">Comments</h3>
//           <button onClick={onClose} className="text-gray-300">
//             ✕
//           </button>
//         </div>

//         <div className="max-h-[55vh] overflow-y-auto divide-y divide-white/5">
//           {items.map((c) => (
//             <CommentItem
//               key={c._id}
//               c={c}
//               onLike={async (cm) => {
//                 await toggleLikeComment(cm._id);
//                 load();
//               }}
//               onEdit={(cm) => {
//                 setEditing(cm);
//                 setText(cm.body);
//               }}
//               onDelete={async (cm) => {
//                 await deleteComment(cm._id);
//                 load();
//               }}
//             />
//           ))}
//           {items.length === 0 && (
//             <div className="py-10 text-center text-gray-400">
//               No comments yet.
//             </div>
//           )}
//         </div>

//         <div className="mt-3 flex gap-2">
//           <input
//             className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
//             placeholder={editing ? "Edit comment..." : "Add a comment..."}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <button
//             onClick={submit}
//             className="px-4 py-2 rounded-lg bg-sky-500 text-white"
//           >
//             {editing ? "Update" : "Comment"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
