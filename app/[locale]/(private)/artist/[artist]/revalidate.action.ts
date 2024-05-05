"use server";
import { revalidatePath } from "next/cache";

export async function revalidateArtist(artistId: string) {
  revalidatePath(`/artist`, "page")
  return revalidatePath(`/artist/${artistId}`, "page")
}