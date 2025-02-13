"use client";

import { ArtistDashboard } from "@/components/artist/ArtistDashboard";
import { useArtistData } from "@/libs/hooks/useArtistData";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/navigation";
import HomeHeader from "@/components/ui/Header/HomeHeader";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { artistSongs, stats, isLoading, fetchArtistData } = useArtistData();

  useEffect(() => {
    if (!session?.user?.profile?.artist) {
      router.push("/");
    }
    if (session?.user?.profile?.artist) {
      fetchArtistData(session.user.profile.artist.id);
    }
  }, [session?.user?.profile?.artist?.id, router]);

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
