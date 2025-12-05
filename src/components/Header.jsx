import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../store/slices/authSlice";
import { uploadAvatar } from "../services/auth";
import { motion, AnimatePresence } from "framer-motion";

const ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
const resolve = (u) =>
  !u ? "" : u.startsWith("/uploads") ? `${ORIGIN}${u}` : u;

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // pull from redux, fall back to localStorage if page reloaded
  const reduxUser = useSelector((s) => s.auth.user);
  const lsUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
  const user = reduxUser || lsUser;

  const [menuOpen, setMenuOpen] = useState(false); // mobile sheet
  const [userOpen, setUserOpen] = useState(false); // desktop avatar dropdown
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function triggerUpload() {
    fileRef.current?.click();
  }

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      setUploading(true);
      const res = await uploadAvatar(fd);
      const avatarUrl = res.data?.data?.avatar || res.data?.avatar;
      const updated = { ...(user || {}), avatar: avatarUrl };
      dispatch(setUser(updated));
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.error("avatar upload error", err);
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[70] bg-[#0b0c10]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* logo */}
        <Link className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
          AnimeVerse
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-gray-300">
          {/* <Link to="/main" className="hover:text-orange-400"> */}
          {/* Home */}
          {/* </Link> */}
          <Link to="/main" className="hover:text-orange-400 font-extrabold">
            Home
          </Link>
          <Link to="/posts" className="hover:text-orange-400 font-extrabold">
            Posts
          </Link>

          <Link to="/anime" className="hover:text-orange-400 font-extrabold">
            Anime
          </Link>
          <Link to="/upgrade" className="hover:text-orange-400 font-extrabold">
            Upgrade
          </Link>
          <Link
            to="/communities"
            className="hover:text-orange-400 font-extrabold"
          >
            Communities
          </Link>
        </nav>

        {/* desktop user area */}
        <div className="hidden md:flex items-center gap-3 relative">
          {!user ? (
            <>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 rounded-md bg-emerald-400 text-black font-semibold"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="text-sm px-4 py-2 rounded-md border border-gray-700 text-gray-200"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setUserOpen((s) => !s)}
                className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-white/5"
              >
                <img
                  src={resolve(user.avatar) || "/default-user.png"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-700"
                />
                {/* username + role ALWAYS visible on desktop */}
                <div className="text-left leading-tight">
                  <div className="text-white font-semibold text-sm truncate max-w-[160px]">
                    {user.username || user.name || user.email}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium capitalize">
                    {user.role || "fan"}
                  </div>
                </div>
                <span className="text-gray-300 ml-1">▾</span>
              </button>

              {/* dropdown */}
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    onMouseLeave={() => setUserOpen(false)}
                    className="absolute right-0 top-14 w-64 bg-[#0f1116] border border-white/10 rounded-lg shadow-xl p-2 z-[80]"
                  >
                    <Link
                      // to="/me"
                      onClick={() => setUserOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-200 rounded hover:bg-white/5"
                    >
                      View profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        triggerUpload();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-200 rounded hover:bg-white/5"
                    >
                      {uploading ? "Uploading…" : "Edit profile (avatar)"}
                    </button>
                    <Link
                      // to="/me/settings"
                      onClick={() => setUserOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-200 rounded hover:bg-white/5"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 rounded hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="md:hidden text-gray-200 text-2xl"
          aria-label="menu"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0f1116]/95 border-t border-white/10 px-4 py-3 space-y-3 z-[60]"
          >
            {/* nav items */}
            {/* <Link */}
            {/* // to="/main" */}
            {/* // onClick={() => setMenuOpen(false)} */}
            {/* // className="block text-gray-300 hover:text-orange-400" */}
            {/* // > */}
            {/* Home */}
            {/* </Link> */}
            <Link
              to="/main"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 font-extrabold hover:text-orange-400"
            >
              Home
            </Link>
            <Link
              to="/posts"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 font-extrabold hover:text-orange-400"
            >
              Posts
            </Link>
            <Link
              to="/anime"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 font-extrabold hover:text-orange-400"
            >
              Anime
            </Link>
            <Link
              to="/upgrade"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 font-extrabold hover:text-orange-400"
            >
              Upgrade
            </Link>
            <Link
              to="/communities"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 font-extrabold hover:text-orange-400"
            >
              Communities
            </Link>

            <div className="border-t border-white/10 pt-3 mt-2">
              {!user ? (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-orange-400 text-orange-400 text-center"
                  >
                    Signup
                  </Link>
                </div>
              ) : (
                <>
                  {/* user summary */}
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={resolve(user.avatar) || "/default-user.png"}
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                    <div className="leading-tight">
                      <div className="text-white font-semibold text-sm">
                        {user.username || user.name || user.email}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {user.role || "fan"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/me"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded bg-white/5 text-gray-200"
                    >
                      View profile
                    </Link>
                    <button
                      onClick={() => {
                        triggerUpload();
                      }}
                      className="px-3 py-2 rounded bg-white/5 text-gray-200 text-left"
                    >
                      {uploading ? "Uploading…" : "Edit avatar"}
                    </button>
                    <Link
                      to="/me/settings"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded bg-white/5 text-gray-200"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-3 py-2 rounded bg-red-600 text-white"
                    >
                      Logout
                    </button>
                  </div>

                  {/* hidden file input for mobile too */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
