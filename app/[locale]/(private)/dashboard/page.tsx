"use client";

import { useUserMode } from "@/context/UserModeContext";
import { ArtistDashboard } from "@/components/artist/ArtistDashboard";
import { useArtistData } from "@/libs/hooks/useArtistData";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import router from "next/router";
import HomeHeader from "@/components/ui/Header/HomeHeader";
interface DashboardProps {
  songs: any[];
  artists: any[];
}

export default function Dashboard({ songs, artists }: DashboardProps) {
  const { isArtistMode } = useUserMode();
  const { data: session } = useSession();
  const { artistSongs, stats, isLoading, fetchArtistData } = useArtistData();

  useEffect(() => {
    if (!isArtistMode) {
      router.push("/");
    }
    if (isArtistMode && session?.user?.profile?.artist) {
      fetchArtistData(session.user.profile.artist.id);
    }
  }, [isArtistMode, session?.user?.profile?.artist?.id]);

  return (
    <main className="flex flex-col flex-1  w-screen items-center pb-10 md:p-10">
      <HomeHeader />
      <ArtistDashboard
        songs={artistSongs}
        stats={stats}
        isLoading={isLoading}
      />
    </main>
  );
}
