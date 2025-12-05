import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Atom } from "react-loading-indicators";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <Atom
          color="#ff8800"
          size="large"
          text="Loading Animeverse..."
          textColor="#ffffff"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 text-white overflow-hidden">
      {/* background with glow */}
      <div className="absolute inset-0">
        <img
          src="\animeimage1.png"
          alt="anime background"
          className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-[4000ms] ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-gray-950/90" />
      </div>

      {/* glowing color blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-purple-700 blur-[120px] opacity-25 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500 blur-[150px] opacity-20 animate-pulse" />

      {/* === top section (logo + buttons) === */}
      <div className="relative z-20 flex justify-between items-center px-10 py-8">
        {/* logo */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-extrabold tracking-wide"
        >
          <span className="text-orange-500">Anime</span>
          <span className="text-white">Verse</span>
        </motion.h1>

        {/* signup / login buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex gap-4"
        >
          <a
            href="/signup"
            className="px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-sm md:text-base font-semibold shadow-[0_0_15px_rgba(255,136,0,0.4)] transition-transform transform hover:scale-105"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="px-6 py-2 rounded-md border border-orange-400 hover:bg-orange-500/20 text-sm md:text-base font-semibold transition-transform transform hover:scale-105"
          >
            Login
          </a>
        </motion.div>
      </div>

      {/* === main hero section === */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[70vh] px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 drop-shadow-[0_0_25px_rgba(255,136,0,0.5)]"
        >
          Unite the <span className="text-orange-400">Anime Fans</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl text-gray-300 text-lg md:text-xl mb-10 leading-relaxed"
        >
          Discover, Discuss, and Decide — the future of anime starts with your
          voice. Join{" "}
          <span className="text-orange-400 font-semibold">AnimeVerse</span> to
          connect with fans and creators around the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <a
            href="/signup"
            className="px-10 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-lg font-semibold shadow-[0_0_20px_rgba(255,136,0,0.4)] transition-transform transform hover:scale-105"
          >
            Join Now
          </a>
          <a
            href="/login"
            className="px-10 py-3 rounded-lg border border-orange-500 text-lg font-semibold hover:bg-orange-600/20 transition-transform transform hover:scale-105"
          >
            Login
          </a>
        </motion.div>
      </div>

      {/* === footer === */}
      <footer className="absolute bottom-0 w-full text-center py-4 text-gray-400 text-sm z-10">
        © 2025 AnimeVerse — Built for anime fans, by anime fans.
      </footer>
    </div>
  );
}
