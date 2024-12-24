import { Artist } from "./artist";
import { Genre } from "./genre";
import { Song } from "./song";

export interface Album {
  id: string;
  name: string;
  image?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  artists?: Artist[];
  genres?: Genre[];
  songs?: Song[];
}
