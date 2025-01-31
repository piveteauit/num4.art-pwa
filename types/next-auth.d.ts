import { Artist, Profile, User } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      profile?: Profile & {
        artist?: Artist;
      };
      isNewUser?: boolean;
    } & User &
      DefaultSession["user"];
  }

  interface User extends DefaultSession["user"] {
    profile?: Profile & {
      artist?: Artist;
    };
    isNewUser?: boolean;
  }
}
