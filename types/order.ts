import { Profile } from "./profile";
import { Song } from "./song";

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  songId: string;
  profileId: string;
  profil: Profile;
  song: Song;
} 