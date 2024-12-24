import { Favorite } from "./favorite";
import { Follow } from "./follow";
import { Order } from "./order";
import { Artist } from "./artist";
import { User } from "./user";

export interface Profile {
  id?: string;
  customerId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId?: string;
  artistId?: string | null;
  artistMode?: boolean;
  locale?: string;
  favorites?: Favorite[];
  follows?: Follow[];
  orders?: Order[];
  artist?: Artist | null;
  user?: User;
}
