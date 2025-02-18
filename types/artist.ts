import { Follow } from "./follow";
import { Profile } from "./profile";
import { Album } from "./album";
import { Genre } from "./genre";
import { Song } from "./song";
import { BankAccount } from "./bankAccount";

export interface Artist {
  id: string;
  name: string;
  image?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  follows?: Follow[];
  profile?: Profile[];
  albums?: Album[];
  genres?: Genre[];
  songs?: Song[];
  bankAccount?: BankAccount;
}

// id: string;
// name: string;
// createdAt: Date;
// updatedAt: Date;
