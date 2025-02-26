import { Artist, Profile, User } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import type { AdapterUser } from "@auth/core/adapters";
import type { Account } from "@auth/core/types";

declare module "@auth/core/providers/nodemailer" {
  interface NodemailerProviderOptions {
    loginOnly?: boolean;
  }
}

declare module "next-auth" {
  /**
   * Types de base pour NextAuth
   */
  interface Session {
    user: {
      id: string;
      isNewUser?: boolean;
    } & User &
      DefaultSession["user"];
  }

  interface User extends DefaultSession["user"] {
    id: string;
    isNewUser?: boolean;
  }
}
