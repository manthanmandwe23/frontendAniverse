// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { BlinkBlur } from "react-loading-indicators";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import { loginUser, googleAuthUrl } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    dispatch(loginStart());
    setLoading(true);
    try {
      const res = await loginUser(form);
      const payload = res.data?.data || res.data;
      if (!payload) throw new Error("Invalid server response");

      const token = payload.token || payload?.token;
      const user = payload.user || payload?.user;

      if (!token) throw new Error("No token returned from server");

      dispatch(loginSuccess({ token, user }));
      try {
        localStorage.setItem("token", token);
      } catch (_) {}
      navigate("/main");
    } catch (err) {
      dispatch(loginFailure(err.message || "Login failed"));
      setMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    setGoogleLoading(true);
    // redirect to backend/google auth endpoint or helper which returns full url
    try {
      window.location.href = googleAuthUrl();
    } catch (err) {
      console.error("Google redirect error:", err);
      setGoogleLoading(false);
      setMsg("Unable to open Google sign-in. Try again.");
    }
  }

  // Visual constants (kept same look as Signup)
  const cardBorder = "border border-orange-500/30";
  const textMuted = "text-gray-300";

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 overflow-hidden">
      {/* subtle background image (use your public assets path) */}
      <img
        src="/animeimage2.png"
        alt="anime backdrop"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      {/* top-left: logo + home link */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#ff8a3d,#7c3aed)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 L19 8 L14 21 L5 21 L2 8 Z"
                fill="#fff"
                opacity="0.95"
              />
            </svg>
          </div>
          <div className="text-white font-semibold">Home</div>
        </Link>
        <Link to={"/signup"} className="flex items-center gap-3">
          <div className="text-white font-semibold">Signup</div>
        </Link>
      </div>

      {/* glowing blobs */}
      <div className="absolute top-20 left-16 w-64 h-64 bg-purple-700 blur-[120px] opacity-18 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 blur-[150px] opacity-18 animate-pulse" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`relative z-10 bg-black/55 backdrop-blur-md ${cardBorder} rounded-2xl shadow-[0_0_35px_rgba(255,136,0,0.14)] p-8 w-[92%] max-w-md text-white`}
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center text-orange-400 drop-shadow">
          Login to AnimeHub
        </h2>

        <p className="text-center text-sm text-gray-300 mb-5">
          Connect with creators, join communities & vote on polls.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-400"
            placeholder="Email"
            value={form.email}
            onChange={update("email")}
          />
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-400"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="accent-orange-400" />
              <span className="text-sm">Remember me</span>
            </label>
            <Link
              to="/forgot"
              className="text-[#06b6d4] hover:underline text-sm"
            >
              Forgot?
            </Link>
          </div>
   
          <div className="flex gap-3">
         
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg py-3 font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(90deg,#ff8a3d,#7c3aed)",
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(255,138,61,0.12)",
                }}
              >
                {loading ? (
                  <BlinkBlur color="#fff" size="small" text="Signing in..." />
                ) : (
                  "Login"
                )}
              </button>
 

            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 flex items-center gap-2"
            >
              {googleLoading ? (
                <BlinkBlur color="#06b6d4" size="small" text="Redirecting..." />
              ) : (
                "Login with Google"
              )}
            </button>
            </div>
    
        </form>

        {msg && (
          <div className="mt-4 text-sm text-center">
            <span className="text-red-400">{msg}</span>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          New to AnimeHub?{" "}
          <Link to="/signup" className="text-orange-400 hover:underline">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
