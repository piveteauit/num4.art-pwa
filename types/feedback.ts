import { User } from "./user";

export interface Feedback {
  id: string;
  review: number;
  message: string;
  email?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  User?: User | null;
} 