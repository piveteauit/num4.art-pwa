"use client";

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
  return <ClientComponent initialSongs={songs} initialArtists={artists} />;
}
