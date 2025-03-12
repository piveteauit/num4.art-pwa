import React from "react";
import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { Link } from "@/navigation";
import SongsPage from "./SongsPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Charger seulement les 12 premières chansons pour le rendu initial
  const initialSongs = await prisma.song.findMany({
    include: {
      artists: {
        include: {
          profile: {
            include: {
              user: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 12
  });

  // Compter le total de chansons pour la pagination
  const totalSongs = await prisma.song.count();

  return <SongsPage initialSongs={initialSongs} totalCount={totalSongs} />;
}
