// src/components/Slider.jsx
import React, { useState, useEffect, useRef } from "react";
import { getHomeSlider } from "../../services/auth";
// import { getHomeSlider } from "../services/auth";

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // Fetch featured anime from backend
  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await getHomeSlider();
        const data = res.data?.data || res.data;
        setSlides(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Slider fetch failed:", err);
      }
    }
    fetchSlides();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!slides.length || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [slides, paused]);

  if (!slides.length) {
    return (
      <div className="w-full h-[380px] bg-gray-800 animate-pulse rounded-xl mt-4"></div>
    );
  }

  const slide = slides[current];

  const ASSET_BASE =
    import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";

  function resolveImage(u) {
    if (!u) return "";
    return u.startsWith("/uploads") ? `${ASSET_BASE}${u}` : u;
  }

  return (
    <div
      className="relative w-full h-[420px] overflow-hidden rounded-xl mt-4 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        src={resolveImage(slide.image)}
        alt={slide.title || "anime-image"}
        // alt={slide.subtitle}
        className="w-full h-full object-cover object-[50%_30%] transition-transform duration-[2000ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* Text Overlay */}
      <div className="absolute bottom-10 left-10 text-white max-w-lg">
        <h1 className="text-4xl font-extrabold drop-shadow-lg mb-2">
          {slide.title}
        </h1>
        {/* <p className="text-sm text-gray-200 line-clamp-3 mb-4"> */}
        {/* {slide.synopsis} */}
        {/* </p> */}

        {/* <div className="flex gap-4"> */}
        {/* Optional buttons */}
        {/* {slide.trailerURL && ( */}
        {/* // // <button className="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold hover:opacity-90"> */}
        {/* Watch Now */}
        {/* </button> */}
        {/* // )} */}
        {/* { slide.title && ( */}
        {/* // // <button className="px-5 py-2 rounded-md border border-gray-400 text-sm font-semibold hover:bg-white/10"> */}
        {/* Join Community */}
        {/* </button> */}
        {/* // )} */}
        {/* </div> */}

        {/* Subtitle */}
        <p className="text-sm text-gray-200 line-clamp-3 mb-4">
          {slide.subtitle}
        </p>

        <div className="flex gap-4">
          {/* Watch Trailer button (optional) */}
          {slide.trailer_url && (
            <button
              onClick={() => window.open(slide.trailer_url, "_blank")}
              className="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold hover:opacity-90"
            >
              Watch Trailer
            </button>
          )}

          {/* Join Community */}
          {slide.title && (
            <button className="px-5 py-2 rounded-md border border-gray-400 text-sm font-semibold hover:bg-white/10">
              Join Community
            </button>
          )}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
              i === current ? "bg-white" : "bg-gray-500/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
