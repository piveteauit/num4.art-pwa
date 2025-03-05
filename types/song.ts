import { Favorite } from "./favorite";
import { Order } from "./order";
import { Album } from "./album";
import { Artist } from "./artist";
import { Genre } from "./genre";
import { Playlist } from "./playlist";

export interface Song {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  audio?: string | null;
  preview?: string | null;
  ISRC?: string | null;
  favorites?: Favorite[];
  orders?: Order[];
  albums?: Album[];
  artists: Artist[];
  genres?: Genre[];
  playlists?: Playlist[];
}
