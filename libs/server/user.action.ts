"use server";
import prisma from "@/libs/prisma"
export async function handleSignUp({ artist, id }: any) {

  let artistId = undefined;

  if (artist) {
    const profileArtist = await prisma.artist.create({
      data: {
        name: artist
      }
    });
    artistId = profileArtist.id;
  }

  const profileUser = await prisma.profile.create({
    data: {
      userId: id,
      artistId,
      artistMode: !!artistId
    }
  });

  return profileUser;
}

export async function setPreferedLocale({
  id,
  locale
}: {
  id: string;
  locale: string;
}) {
  return await prisma.profile.update({
    where: { id },
    data: { locale }
  });
}

export async function setCurrentMode({
  id,
  artistMode
}: {
  id: string;
  artistMode: boolean;
}) {
  console.log(id, artistMode);
  return await prisma.profile.update({
    where: { id },
    data: { artistMode }
  });
}

export async function likeSong(userId: string, songId: string) {
  const profile = await prisma.profile.findFirst({ where: { user: { id: userId } } });

  return await prisma.favorite.create({
    data: { 
      song: {
        connect: {
          id: songId
        },
      },
      profil: {
        connect: {
          id: profile.id
        }
      }
    },
  });
  // 
}
 
export async function unlikeSong(favoriteId: string) {
  return await prisma.favorite.delete({
    where: { id: favoriteId }
  });
  // 
 }

export async function getProfile() { }
