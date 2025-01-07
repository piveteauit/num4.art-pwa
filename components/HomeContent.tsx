"use client";

import { useUserMode } from "@/context/UserModeContext";
import ClientComponent from "@/components/client/ClientComponent";

interface HomeContentProps {
  songs: any[];
  artists: any[];
}

export default function HomeContent({ songs, artists }: HomeContentProps) {
  const { isArtistMode } = useUserMode();

  return (
    <>
      {isArtistMode ? (
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Hello</h1>
        </div>
      ) : (
        <ClientComponent initialSongs={songs} initialArtists={artists} />
      )}
    </>
  );
}
