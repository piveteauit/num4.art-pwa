import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/libs/prisma";
import EmailProvider from "next-auth/providers/nodemailer";
import { sendEmail } from "@/libs/sendEmail";
import type { NextAuthConfig } from "next-auth";
import { server } from "./config";

const adapter = PrismaAdapter(prisma);

export const config = {
  adapter,
  session: {
    strategy: "jwt"
  },
  providers: [
    EmailProvider({
      sendVerificationRequest: async (params) => {
        await sendEmail({
          from: "noreply@num4.art",
          to: params.identifier,
          subject: "Sign in to Num4",
          html: `<h1>Sign in</h1><p>Use the code below to sign in:</p><p>${params.token}</p>`
        });
      },
      generateVerificationToken: async () => {
        return new Promise((resolve) => {
          const token = `${Array(6)
            .fill(() => Math.floor(Math.random() * 10))
            .map((f) => f())
            .join("")}`;
          resolve(token);
        });
      },
      server,
      from: "noreply@num4.art"
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser;
        token.profile = user.profile;
      }

      if (trigger === "update" && session) {
        token.profile = session.user?.profile;
        token.isNewUser = session.user?.isNewUser;
        token.email = session.user?.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        const user = session.user;

        user.id = token.sub as string;
        user.isNewUser = Boolean(token.isNewUser);

        const userProfile = await prisma.profile.findFirst({
          where: {
            userId: user.id
          },
          include: {
            artist: true || false,
            // artist id

            user: true,
            orders: true
          }
        });

        user.isNewUser = !userProfile;
        if (userProfile) {
          user.profile = userProfile;
        }
        // user.profile.artistId = userProfile?.artist?.id;

        session.user = user;
      }

      return session;
    }
  },
  pages: {
    newUser: "/me/welcome"
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
