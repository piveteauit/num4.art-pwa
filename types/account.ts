import { User } from "./user";

export interface Account {
  id: string;
  userId: string;
  providerAccountId: string;
  access_token?: string | null;
  expires_at?: number | null;
  id_token?: string | null;
  provider: string;
  refresh_token?: string | null;
  scope?: string | null;
  session_state?: string | null;
  token_type?: string | null;
  type: string;
  user: User;
} 