"use server";

import prisma from "@/libs/prisma";


export async function addSong({ title, price, genres, albums, description, image, audio, preview, artists }: any) {
  genres = []
  return await prisma
    .song.create({
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
    })
}

export async function getAllSongs() {
  return await prisma
    .song.findMany({})
}

export async function getProfile() { }
