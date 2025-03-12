"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import BackButton from "@/components/ui/Button/BackButton";
// Composant skeleton pour le chargement des chansons
const SongSkeleton = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="relative h-[180px] w-[180px] m-auto rounded-md overflow-hidden bg-gray-700/40"></div>
    <div className="flex flex-col items-start text-white mt-2 w-[180px]">
      <div className="h-4 w-full bg-gray-700/40 rounded-md mb-1"></div>
      <div className="h-3 w-24 bg-gray-700/40 rounded-md"></div>
    </div>
  </div>
);

// Animation variants pour framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function SongsPage({
  initialSongs,
  totalCount
}: {
  initialSongs: any[];
  totalCount: number;
}) {
  const [songs, setSongs] = useState<any[]>(initialSongs);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);
  const inView = useInView(loadMoreRef, { once: false });

  // Fonction pour charger plus de chansons
  const loadMoreSongs = async () => {
    if (isLoading || songs.length >= totalCount) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/songs?page=${page + 1}&limit=12`);
      const data = await res.json();

      if (data.songs.length > 0) {
        setSongs((prev) => [...prev, ...data.songs]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des morceaux:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Détecter quand l'utilisateur atteint le bas de la page
  useEffect(() => {
    if (inView) {
      loadMoreSongs();
    }
  }, [inView]);

  return (
    <>
      <BackButton />
      <main className="w-screen flex-1 md:p-8">
        <section className="pt-20 p-2 w-screen lg:max-w-3xl lg:mt-10 pb-20 mx-auto">
          <h3 className="text-xl mb-4">Tous les morceaux</h3>

          <motion.div
            className="grid grid-cols-2 gap-4 justify-center lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {songs.map((song, i) => (
                <motion.div
                  key={`song-${song.id}-${i}`}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: (i % 12) * 0.05 // Décalage pour effet en cascade
                  }}
                >
                  <Link
                    href={{
                      pathname: "/song/[song]",
                      params: { song: song.id }
                    }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative h-[180px] w-[180px] m-auto rounded-md overflow-hidden">
                      <ImageWithFallback
                        src={song?.image || ""}
                        alt="jaquette musique"
                        fill
                      />
                    </div>
                    <div className="flex flex-col items-start text-white mt-2">
                      <span className="block w-[180px] truncate">
                        {song.title}
                      </span>
                      <span className="text-xs opacity-75">
                        {song.artists?.[0]?.name || "Artiste inconnu"}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Indicateur de chargement et point de référence pour l'infinite scroll */}
          {songs.length < totalCount && (
            <div
              ref={loadMoreRef}
              className="mt-8 grid grid-cols-2 gap-4 justify-center lg:grid-cols-4"
            >
              {isLoading &&
                Array(4)
                  .fill(0)
                  .map((_, i) => <SongSkeleton key={`skeleton-${i}`} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
