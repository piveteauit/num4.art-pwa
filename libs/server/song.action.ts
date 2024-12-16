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
  preview,
  artists
}: any) {
  genres = [];
  return await prisma.song.create({
    data: {
      title,
      image,
      audio,
      preview,
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

export async function buySong({ songId, profileId }: any) {
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

  return result;
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
