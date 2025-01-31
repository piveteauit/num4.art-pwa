"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import SkeletonSong from "@/components/ui/SkeletonSong";
import { usePlayMusic } from "@/hooks/usePlayMusic";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface SongsListProps {
  songs: any[];
  onSongClick?: (song: any) => void;
  isClickable?: boolean;
}

export const SongsList = ({
  songs,
  onSongClick,
  isClickable = true
}: SongsListProps) => {
  const { isQueueReady } = usePlayer();
  const { handlePlay } = usePlayMusic();

  const handleSongClick = (song: any) => {
    if (onSongClick) {
      onSongClick(song);
    } else if (isClickable) {
      handlePlay(song);
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`transition-opacity duration-1000 ease-in-out absolute w-full flex flex-col gap-4 pointer-events-none ${
          !isQueueReady ? "opacity-100" : "opacity-0"
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
          isQueueReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {songs.map((song) => (
          <div
            onClick={() => handleSongClick(song)}
            key={`${song.id}--${song.title}--2`}
            className={isClickable ? "cursor-pointer" : ""}
          >
            <div className="flex w-full gap-8">
              <span className="relative w-[52px] h-[52px]">
                {/* <Image
                  className="max-h-[52px] object-cover rounded-sm"
                  fill
                  alt={`Jaquette ${song.title}`}
                  src={song.image}
                /> */}
                <ImageWithFallback
                  // src={song.image}
                  src={"/assets/images/PHOTO-2024-01-22-17-14-05.jpg"}
                  alt={`Jaquette ${song.title}`}
                  fill
                />
              </span>
              <div className="flex flex-col items-start">
                <h4 className="font-semibold text-xl">{song.title}</h4>
                <Link
                  href={{
                    pathname: "/artist/[artist]",
                    params: { artist: song.artists?.[0]?.name }
                  }}
                  className="opacity-60"
                >
                  {song.artists?.[0]?.name || "Artiste inconnu"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
