"use server";

import { prisma } from "@/libs/prisma";

export async function addAvatarToBdd(url: string, userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { image: url }
  });
}
