"use client";

import { Link } from "@/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Song } from "@/types/song";
import SkeletonSong from "@/components/ui/SkeletonSong";
import { ReactNode } from "react";

interface BaseSongsListProps {
  songs: Song[];
  renderActions?: (song: Song) => ReactNode;
  onSongClick?: (song: Song) => void;
  isClickable?: boolean;
  isLoading?: boolean;
}

export const BaseSongsList = ({
  songs,
  renderActions,
  onSongClick,
  isClickable = true,
  isLoading = false
}: BaseSongsListProps) => {
  const handleSongClick = (song: Song) => {
    if (onSongClick) {
      onSongClick(song);
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`transition-opacity duration-1000 ease-in-out absolute w-full flex flex-col gap-4 pointer-events-none ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        {[...Array(6)].map((_, index) => (
          <div key={`skeleton-${index}`}>
            <SkeletonSong />
          </div>
        ))}
      </div>

      <div
        className={`flex flex-col w-full transition-opacity duration-1000 gap-4 ease-in-out ${
          !isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        {songs.map((song) => (
          <div
            key={`${song.id}--${song.title}`}
            className="flex items-center justify-between w-full"
          >
            <div
              onClick={() => handleSongClick(song)}
              className={`flex gap-8 flex-1 ${isClickable ? "cursor-pointer" : ""}`}
            >
              <span className="relative w-[52px] h-[52px]">
                <ImageWithFallback
                  src={song.image}
                  alt={`Jaquette ${song.title}`}
                  fill
                />
              </span>
              <div className="flex flex-col flex-1 items-start">
                <h4 className="font-semibold text-xl">{song.title}</h4>
                {/* <Link
                href={{
                  pathname: "/artist/[artist]",
                  params: { artist: song.artists?.[0]?.name }
                }}
                className="opacity-60"
              >
                {song.artists?.[0]?.name || "Artiste inconnu"}
              </Link> */}
                <p className="opacity-60">
                  {song.artists?.[0]?.name || "Artiste inconnu"}
                </p>
              </div>
            </div>
            {renderActions && renderActions(song)}
          </div>
        ))}
      </div>
    </div>
  );
};
