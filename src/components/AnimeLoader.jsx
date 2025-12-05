// src/components/PageLoader.jsx
import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";

export default function PageLoader({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3 shadow-xl">
        <Atom size="large" />
        <div className="text-white">Warping through the Animeverse...</div>
      </div>
    </div>
  );
}
