import { Artist } from "./artist";

export type BankAccount = {
  id: string;
  name: string;
  email: string;
  iban: string;
  bic: string;
  createdAt: Date;
  updatedAt: Date;
  artist: Artist;
};
