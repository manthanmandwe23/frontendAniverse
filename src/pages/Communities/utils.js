// src/pages/Communities/utils.js

export function looksMember(c, myId) {
  if (!c || !myId) return false;
  if (typeof c.isMember === "boolean") return c.isMember;
  if (Array.isArray(c.members)) {
    return c.members.some((m) => String(m) === String(myId));
  }
  return false;
}

export function formatTime(x) {
  try {
    const d = new Date(x);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
