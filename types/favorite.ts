import { Profile } from "./profile";
import { Song } from "./song";

export interface Favorite {
  id?: string;
  songId?: string;
  profileId?: string;
  profil?: Profile;
  song?: Song;
}
