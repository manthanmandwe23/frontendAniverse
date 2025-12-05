import { useState } from "react";
import { createPostJSON, createPostMultipart } from "../../services/posts";
import { cloudUpload } from "../../lib/cloudinary";

export default function CreatePostModal({ onClose, onCreated }) {
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    if (!body.trim() && images.length === 0) {
      setErr("Write something or upload an image");
      return;
    }
    setBusy(true);
    setErr("");

    try {
      // CLOUD FIRST
      const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

      if (cloud && preset && images.length) {
        const uploaded = [];
        for (const f of images) {
          const u = await cloudUpload(f);
          uploaded.push({ url: u.url, type: "image" });
        }
        await createPostJSON({
          body: body.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
          media: uploaded,
          scope: "global",
        });
      } else {
        // FALLBACK LOCAL MULTIPART
        const fd = new FormData();
        fd.append("body", body.trim());
        fd.append(
          "tags",
          JSON.stringify(
            tags
              .split(",")
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean)
          )
        );
        images.forEach((f) => fd.append("images", f));
        await createPostMultipart(fd);
      }

      onCreated?.();
      onClose();
      // Broadcast to feeds without full reload
      document.dispatchEvent(new CustomEvent("feed-refresh"));
    } catch (e) {
      setErr(e?.message || "Failed to create post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-[#121218] w-full max-w-lg rounded-xl border border-white/10 p-6">
        <h3 className="text-white text-xl font-semibold mb-4">Create Post</h3>

        {err && <div className="text-red-400 text-sm mb-2">{err}</div>}

        <textarea
          className="w-full h-28 bg-black/20 text-white p-3 rounded-lg outline-none mb-3"
          placeholder="Share something…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label className="text-sm text-gray-300">Tags (comma separated)</label>
        <input
          className="w-full bg-black/20 text-white p-2 rounded-lg outline-none mb-4"
          placeholder="onepiece, manga, cosplay"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <label className="text-sm text-gray-300 block mb-1">
          Upload Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          className="text-white mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            Cancel
          </button>
          <button
            disabled={busy}
            onClick={submit}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            {busy ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
