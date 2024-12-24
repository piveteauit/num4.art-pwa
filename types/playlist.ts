import { Song } from "./song";

export interface Playlist {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  songs: Song[];
} 