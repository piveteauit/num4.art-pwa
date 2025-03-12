"use client";

import React from "react";

export default function SkeletonSongDetails() {
  return (
    <div className="w-full flex flex-col items-center gap-6 pt-4 animate-pulse">
      {/* Image de la chanson */}
      <div className="relative w-[28svh] h-[28svh] rounded-lg bg-gray-700/40"></div>

      {/* Titre, artiste et genres */}
      <div className="flex flex-col gap-2 items-center">
        <div className="h-7 w-48 bg-gray-700/40 rounded-md"></div>
        <div className="h-6 w-40 bg-gray-700/40 rounded-md mt-1"></div>
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-16 bg-gray-700/40 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-700/40 rounded-full"></div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-4 justify-center mt-4">
        <div className="h-10 w-32 bg-gray-700/40 rounded-full"></div>
        <div className="h-10 w-32 bg-gray-700/40 rounded-full"></div>
      </div>

      {/* Autres morceaux */}
      <div className="w-full mt-12">
        <div className="h-7 w-48 bg-gray-700/40 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="h-[120px] w-[120px] bg-gray-700/40 rounded-md"></div>
                <div className="h-4 w-32 bg-gray-700/40 rounded-md mt-2"></div>
                <div className="h-3 w-24 bg-gray-700/40 rounded-md mt-1"></div>
              </div>
            ))}
        </div>
      </div>

      {/* Description */}
      <div className="w-full mt-12 mx-6 p-6 bg-white/5 rounded-xl">
        <div className="h-6 w-32 bg-gray-700/40 rounded-md mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-700/40 rounded-md"></div>
          <div className="h-4 w-full bg-gray-700/40 rounded-md"></div>
          <div className="h-4 w-3/4 bg-gray-700/40 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
