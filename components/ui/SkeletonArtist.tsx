"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SkeletonArtist() {
  // Animation en pulsation pour le skeleton
  return (
    <div className="w-full flex flex-col items-center gap-6 pt-4 animate-pulse">
      {/* Image d'artiste */}
      <div className="relative w-[28svh] h-[28svh] rounded-full bg-gray-700/40"></div>

      {/* Nom et stats */}
      <div className="flex flex-col gap-2 items-center">
        <div className="h-8 w-48 bg-gray-700/40 rounded-md"></div>
        <div className="flex justify-center gap-8 pt-2">
          <div className="h-6 w-16 bg-gray-700/40 rounded-md"></div>
          <div className="h-6 w-16 bg-gray-700/40 rounded-md"></div>
        </div>
      </div>

      {/* Bouton */}
      <div className="h-10 w-32 bg-gray-700/40 rounded-full mt-2"></div>

      {/* Liste des chansons */}
      <div className="w-full mt-12">
        <div className="h-7 w-48 bg-gray-700/40 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="h-[180px] w-[180px] bg-gray-700/40 rounded-md"></div>
                <div className="h-4 w-32 bg-gray-700/40 rounded-md mt-2"></div>
                <div className="h-3 w-24 bg-gray-700/40 rounded-md mt-1"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
