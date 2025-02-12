"use client";

import { useUserMode } from "@/context/UserModeContext";
import ClientComponent from "@/components/client/ClientComponent";
import { ArtistDashboard } from "@/components/artist/ArtistDashboard";
import { useArtistData } from "@/libs/hooks/useArtistData";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface HomeContentProps {
  songs: any[];
  artists: any[];
}

export default function HomeContent({ songs, artists }: HomeContentProps) {
  const { isArtistMode } = useUserMode();
  const { data: session } = useSession();
  const { artistSongs, stats, isLoading, fetchArtistData } = useArtistData();

  useEffect(() => {
    if (isArtistMode && session?.user?.profile?.artist) {
      fetchArtistData(session.user.profile.artist.id);
    }
  }, [isArtistMode, session?.user?.profile?.artist?.id]);

  if (isArtistMode) {
    return (
      <ArtistDashboard
        songs={artistSongs}
        stats={stats}
        isLoading={isLoading}
      />
    );
  }

  return <ClientComponent initialSongs={songs} initialArtists={artists} />;
}
