import { Artist } from "./artist";
import { Profile } from "./profile";

export interface Follow {
  id: string;
  artistId: string;
  profileId: string;
  artist: Artist;
  profil: Profile;
} 