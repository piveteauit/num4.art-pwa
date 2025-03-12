"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import BackButton from "@/components/ui/Button/BackButton";
// Type pour les artistes
interface Artist {
  id: string;
  name: string;
  image: string;
}

// Composant skeleton pour le chargement
const ArtistSkeleton = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="relative h-[180px] w-[180px] m-auto rounded-full overflow-hidden bg-gray-700/40"></div>
    <div className="flex flex-col items-center text-white mt-2">
      <div className="h-4 w-24 bg-gray-700/40 rounded-md"></div>
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

export default function ArtistsPage({
  initialArtists,
  totalCount
}: {
  initialArtists: Artist[];
  totalCount: number;
}) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);
  const inView = useInView(loadMoreRef, { once: false });

  // Fonction pour charger plus d'artistes
  const loadMoreArtists = async () => {
    if (isLoading || artists.length >= totalCount) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/artists?page=${page + 1}&limit=12`);
      const data = await res.json();

      if (data.artists.length > 0) {
        setArtists((prev) => [...prev, ...data.artists]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des artistes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Détecter quand l'utilisateur atteint le bas de la page
  useEffect(() => {
    if (inView) {
      loadMoreArtists();
    }
  }, [inView]);

  return (
    <>
      <BackButton />
      <main className="w-screen h-screen md:p-8">
        <section className="pt-20 p-2 w-screen lg:max-w-3xl lg:mt-10 pb-20 mx-auto">
          <h3 className="text-xl mb-4">Tous les artistes</h3>

          <motion.div
            className="grid grid-cols-2 gap-4 justify-center lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {artists.map((artist, i) => (
                <motion.div
                  key={`artist-${artist?.id}-${i}`}
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
                      pathname: "/artist/[artist]",
                      query: { id: artist.id },
                      params: { artist: artist?.id }
                    }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative h-[180px] w-[180px] m-auto rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={artist?.image}
                        alt={`Avatar ${artist?.name}`}
                        className="avatar !rounded-full !w-[180px] !h-[180px] aspect-square"
                        width={180}
                        height={180}
                      />
                    </div>
                    <div className="flex flex-col items-center text-white mt-2">
                      <span className="font-semibold">{artist.name}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Indicateur de chargement et point de référence pour l'infinite scroll */}
          {artists.length < totalCount && (
            <div
              ref={loadMoreRef}
              className="mt-8 grid grid-cols-2 gap-4 justify-center lg:grid-cols-4"
            >
              {isLoading &&
                Array(4)
                  .fill(0)
                  .map((_, i) => <ArtistSkeleton key={`skeleton-${i}`} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
