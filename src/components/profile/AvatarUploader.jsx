import api from "../../lib/api";
import { cloudUpload } from "../../lib/cloudinary";

export default function AvatarUploader({ me, onDone }) {
  async function onChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const up = await cloudUpload(f);
    await api.patch("/users/me/avatar", { avatar: up.secure_url || up.url });
    onDone?.(up.secure_url || up.url);
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={me?.avatar || "/default-user.png"}
        className="w-14 h-14 rounded-full object-cover"
      />
      <input type="file" accept="image/*" onChange={onChange} />
    </div>
  );
}
