"use server";

import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";

export async function addSong({
  title,
  price,
  genres,
  albums,
  description,
  image,
  audio,
  previewStartTime,
  artists
}: any) {
  genres = [];

  return await prisma.song.create({
    data: {
      title,
      image,
      audio,
      previewStartTime,
      description,
      artists: {
        connect: artists?.map((id: string) => ({ id }))
      },
      genres: {
        connect: genres?.map((id: string) => ({ id }))
      },
      albums: {
        connect: albums?.map((id: string) => ({ id }))
      },
      price
    }
  });
}

export async function updateSong({
  songId,
  data
}: {
  songId: string;
  data: any;
}) {
  return await prisma.song.update({ where: { id: songId }, data });
}

export async function buySong({
  songId,
  profileId
}: {
  songId?: string;
  profileId?: string;
}) {
  try {
    const result = await prisma.order.create({
      data: {
        profil: {
          connect: {
            id: profileId
          }
        },
        song: {
          connect: {
            id: songId
          }
        }
      }
    });

    // Revalider le chemin de la page du morceau
    revalidatePath("/song");

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Échec de l'achat du morceau");
  }
}

export async function getAllSongs() {
  return await prisma.song.findMany({
    include: {
      albums: true,
      artists: true,
      favorites: {
        select: {
          profil: {
            select: {
              userId: true
            }
          }
        }
      }
    }
  });
}

export async function getProfile() {}
