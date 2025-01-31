import { Album } from "./album";
import { Artist } from "./artist";
import { Song } from "./song";

export interface Genre {
  id: string;
  label: string;
  albums?: Album[];
  artists?: Artist[];
  songs?: Song[];
} 