import React from "react";
import { prisma } from "@/libs/prisma";
import ArtistsPage from "./ArtistsPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Charger seulement les 12 premiers artistes pour le rendu initial
  const initialArtists = (
    await prisma.artist.findMany({
      include: {
        profile: {
          include: {
            user: true
          }
        }
      },
      take: 12,
      orderBy: {
        name: "asc"
      }
    })
  ).map((a) => ({
    ...a,
    image:
      a?.profile?.[0]?.user?.image || "/assets/images/logos/meduse-icon.png"
  }));

  // Compter le total d'artistes pour la pagination
  const totalArtists = await prisma.artist.count();

  return (
    <ArtistsPage initialArtists={initialArtists} totalCount={totalArtists} />
  );
}
