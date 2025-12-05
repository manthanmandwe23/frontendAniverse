import { useEffect, useState } from "react";
import {
  listComments,
  addComment,
  toggleLikeComment,
  updateComment,
  deleteComment,
} from "../../../services/posts";

function Row({ c, onReply, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.body);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-600" />
        <div className="text-sm text-white">{c.author_name || "User"}</div>
      </div>

      {editing ? (
        <div className="mt-2">
          <textarea
            className="w-full bg-black/20 text-white p-2 rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                await updateComment(c._id, text);
                setEditing(false);
                onChanged();
              }}
              className="text-indigo-400 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-200 mt-1">{c.body}</p>
      )}

      <div className="flex gap-4 text-xs text-gray-400 mt-1">
        <button
          onClick={async () => {
            await toggleLikeComment(c._id);
            onChanged();
          }}
        >
          Like
        </button>
        <button onClick={() => onReply(c)}>Reply</button>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button
          onClick={async () => {
            await deleteComment(c._id);
            onChanged();
          }}
          className="text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CommentsDrawer({ postId, onClose }) {
  const [list, setList] = useState([]);
  const [replies, setReplies] = useState({});
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const reload = async () => {
    const res = await listComments(postId, null, 1, 50);
    setList(res.data?.data?.items || []);
  };
  const loadReplies = async (parentId) => {
    const res = await listComments(postId, parentId, 1, 50);
    setReplies((r) => ({ ...r, [parentId]: res.data?.data?.items || [] }));
  };

  useEffect(() => {
    reload();
  }, [postId]);

  async function send() {
    if (!text.trim()) return;
    await addComment(postId, text.trim(), replyTo?._id);
    setText("");
    setReplyTo(null);
    replyTo ? loadReplies(replyTo._id) : reload();
    // live update feed counts
    document.dispatchEvent(new CustomEvent("feed-refresh"));
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#0f0f14] border-l border-white/10 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Comments</h3>
          <button onClick={onClose} className="text-gray-300">
            Close
          </button>
        </div>

        {replyTo && (
          <div className="text-xs text-indigo-300 mb-1">
            Replying to{" "}
            <span className="text-white">{replyTo.author_name || "User"}</span>
            <button
              className="ml-2 text-gray-400"
              onClick={() => setReplyTo(null)}
            >
              cancel
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-black/20 text-white p-2 rounded"
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={send}
            className="px-4 bg-indigo-600 rounded text-white"
          >
            Send
          </button>
        </div>

        {list.map((c) => (
          <div key={c._id} className="border-b border-white/5 pb-3 mb-3">
            <Row c={c} onReply={setReplyTo} onChanged={reload} />
            <button
              className="text-xs text-gray-400 mt-2"
              onClick={() => loadReplies(c._id)}
            >
              View replies
            </button>
            {(replies[c._id] || []).map((rc) => (
              <div key={rc._id} className="ml-10">
                <Row
                  c={rc}
                  onReply={setReplyTo}
                  onChanged={() => loadReplies(c._id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
