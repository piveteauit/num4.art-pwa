"use server";

import { prisma } from "@/libs/prisma";

export async function getArtistIdByUserId(userId: string) {
  const profile = await prisma.profile.findFirst({
    where: { userId },
    include: {
      artist: true
    }
  });

  return profile?.artist?.id;
}
